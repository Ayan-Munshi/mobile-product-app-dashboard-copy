import UserProfile from "@/components/custom/UserProfile";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import moment from "moment";
import { useForm } from "react-hook-form";
import ApptSlotBooking from "./ApptSlotBooking";
import {
  useCreateNewPatientMutation,
  useLazyGetpatientDetailsQuery,
} from "@/redux/practiceDashBoard/apiSlice";
import { useSelector } from "react-redux";
import { useState } from "react";
import SkeletonAppointmentDrawer from "@/components/custom/skeletons/SkeletonAppointmentDrawer";
import { RootState } from "@/redux/store";
import {
  AppointmentDetailsType,
  SyncAppointmentDataType,
  OnSubmitDataType,
} from "@/types/appointments";
import { Icon } from "@iconify/react/dist/iconify.js";

type AppProps = {
  isOpen: boolean;
  onClose: () => void;
  appointmentDetails: AppointmentDetailsType;
  syncAppointment: (data: SyncAppointmentDataType) => void;
  handleAppointmentDelete: () => void;
  AppoitmentDetailsFetching: boolean;
  activeTab: string;
  handleUpdateAptStatus?: (data: { aptId: string; status: string }) => void;
  // handleDeleteApt?: (data: string) => void;
};

//This function returns a background and text color based on the provided status by mapping it to predefined styles.
const statusClass = (status: string) => {
  const statusMap = {
    Confirmed: { bgColor: "#9BECC873", color: "#054025", icon: "subway:tick" },
    Unsynced: { bgColor: "#E5E5E5", color: "#514C09", icon: "mdi:sync-alert" },
    Cancelled: { bgColor: "#e6d6d6", color: "#800000ad", icon: "mdi:cancel" },
    Broken: {
      bgColor: "#ffe1e1",
      color: "#800000ad",
      icon: "tabler:alert-circle",
    },
    Deleted: { bgColor: "#E0E0E0", color: "#B22222", icon: "mi:delete" },
    Complete: {
      bgColor: "#9BECC873",
      color: "#054025",
      icon: "charm:circle-tick",
    },
    Unconfirmed: {
      bgColor: "#ECE99B73",
      color: "#808000",
      icon: "tabler:clock",
    },
    None: { bgColor: "#FFFFFF", color: "#000000", icon: "" },
  };

  // Returns the background and text color, along with icon, or defaults if the status is not found.
  return (
    statusMap[status as keyof typeof statusMap] || {
      bgColor: "#FFFFFF", // Default background color
      color: "#000000", // Default text color
      icon: "", // Default icon
    }
  );
};

//*** Main return function

const AppointmentDrawer = ({
  isOpen,
  onClose,
  appointmentDetails,
  syncAppointment,
  handleAppointmentDelete,
  AppoitmentDetailsFetching,
  activeTab,
  handleUpdateAptStatus,
}: // handleDeleteApt,
AppProps) => {
  //useForm
  const {
    control,
    watch,
    setValue,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    // We didn't use camelCase here due to backend key requirements.
    defaultValues: {
      providerDetails: {
        pms_prov_num: null,
        provider_id: "",
        provider_display_name: "",
      },
      bookingSlotDetails: {
        slotStart: "",
        provNum: "",
        opNum: "",
      },
    },
  });
  const [appointmentDate, setAppointmentDate] = useState<
    Date | null | undefined
  >(null); // Default to today's date
  const { bgColor, color, icon } = statusClass(
    getAppointmentStatus(appointmentDetails)
  );
  // Create new Patient
  const [createNewPatient] = useCreateNewPatientMutation();

  // get patient details
  const [getPatientDetailsTrigger] = useLazyGetpatientDetailsQuery();

  const { bookingSlotDetails, providerDetails } = watch();
  const persistPracticeId = useSelector(
    (state: RootState) => state?.persisted?.practice?.persistPracticeDetails?.id
  );

  // Submits form data by merging temporary details with fallback values and adding practiceId.
  const onSubmit = async (data: OnSubmitDataType) => {
    try {
      const finalData = {
        practiceId: persistPracticeId,
        firstName:
          appointmentDetails?.temp_details?.firstName ||
          appointmentDetails?.pat_first_name,
        lastName:
          appointmentDetails?.temp_details?.lastName ||
          appointmentDetails?.pat_last_name,
        dob:
          appointmentDetails?.temp_details?.dob || appointmentDetails?.pat_dob,
      };

      // Triggering API call and awaiting response
      const patientDetails = await getPatientDetailsTrigger(finalData).unwrap();
      if (patientDetails?.message?.includes("Patient does not exist")) {
        // Create new patient if not found
        const createNewPatientResponse = await createNewPatient({
          ...data,
          ...finalData,
          email: appointmentDetails?.temp_details?.email,
          phone: appointmentDetails?.temp_details?.phone,
        });
        if (createNewPatientResponse?.data?.pms_pat_num) {
          const finalData = {
            practiceId: persistPracticeId,
            pmsPatNum: createNewPatientResponse?.data?.pms_pat_num,
            isNewPatient: true,
            pmsOpNum: bookingSlotDetails?.opNum,
            pmsProvNum: bookingSlotDetails?.provNum,
            aptDate: appointmentDate
              ? moment(appointmentDate).format("YYYY-MM-DD")
              : null,
            startTime: bookingSlotDetails?.slotStart
              ? moment(bookingSlotDetails?.slotStart, "hh:mm A").format(
                  "HH:mm:ss"
                )
              : null,
            appointmentId: appointmentDetails?.id,
          };
          syncAppointment(finalData);
          onClose();
        }
      } else if (patientDetails?.result?.pms_pat_num) {
        const finalData = {
          practiceId: persistPracticeId,
          pmsPatNum: patientDetails?.result?.pms_pat_num,
          isNewPatient: true,
          pmsOpNum: bookingSlotDetails?.opNum,
          pmsProvNum: bookingSlotDetails?.provNum,
          aptDate: appointmentDate
            ? moment(appointmentDate).format("YYYY-MM-DD")
            : null,
          startTime: bookingSlotDetails?.slotStart
            ? moment(bookingSlotDetails?.slotStart, "hh:mm A").format(
                "HH:mm:ss"
              )
            : null,
          appointmentId: appointmentDetails?.id,
        };
        syncAppointment(finalData);
        onClose();
      }
    } catch {
      onClose(); //
    }
  };

  function getAppointmentStatus(item: AppointmentDetailsType) {
    if (item?.is_synced === false) {
      return "Unsynced";
    } else if (item?.is_deleted === 1) {
      return "Deleted";
    } else if (item?.pms_apt_status === "Complete") {
      return "Complete";
    } else if (item?.pms_apt_status === "Broken") {
      return "Broken";
    } else if (item?.pms_apt_status === "UnschedList") {
      return "Cancelled";
    } else if (
      item?.pms_apt_status === "Scheduled" &&
      item?.is_confirmed === false
    ) {
      return "Unconfirmed";
    } else if (item?.pms_apt_status === "Scheduled" && item?.is_confirmed) {
      return "Confirmed";
    }
    return "None";
  }

  // *** main return
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        id="appointment-details"
        className="overflow-y-auto sm:max-w-[700px] rounded-[10px] p-0 pb-10 [&_.absolute.right-4.top-4]:hidden"
      >
        {AppoitmentDetailsFetching ? (
          <SkeletonAppointmentDrawer />
        ) : (
          <div>
            <SheetHeader className="flex flex-row justify-between px-3">
              <div className="px-7 py-6 space-y-1">
                <SheetTitle className="text-xl font-medium text-[#373737]">
                  Appointment Details
                </SheetTitle>
                <SheetDescription className="text-base">
                  Showing details of appointment{" "}
                  {appointmentDetails?.pms_apt_num
                    ? appointmentDetails?.pms_apt_num
                    : ""}
                </SheetDescription>
              </div>
              <SheetClose className=" flex items-start  ">
                <Icon
                  icon="maki:cross"
                  className="text-gray-500 size-5 rounded-full border-2 border-gray-400 p-0.5 mt-5 "
                />
              </SheetClose>
            </SheetHeader>
            <hr className=" border-t-2 border-[#c8c8c8]" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 px-7 py-6 gap-10 text-base">
              <div className="col-span-1">
                Date Scheduled:{" "}
                <span className="text-[#717171]">
                  {appointmentDetails?.date_scheduled
                    ? moment(appointmentDetails?.date_scheduled).format(
                        "YYYY-MM-DD"
                      )
                    : "--/--"}
                </span>
              </div>
              <div className="col-span-1">
                Appt Time:{" "}
                <span className="text-[#717171]">
                  {appointmentDetails?.apt_date
                    ? appointmentDetails?.apt_date
                    : "--/--"}
                </span>
                {appointmentDetails?.start_time ? (
                  <span className="bg-[#ededed] text-[#727272] py-1 px-3 rounded-sm ml-3">
                    {appointmentDetails?.start_time
                      ? moment(
                          appointmentDetails?.start_time,
                          "HH:mm:ss"
                        ).format("hh:mm A")
                      : ""}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="col-span-1">
                Reason:{" "}
                <span className="text-[#717171]">
                  {appointmentDetails?.reason_for_visit
                    ? appointmentDetails?.reason_for_visit
                    : "--/--"}
                </span>
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <p>Status:</p>
                <div
                  className="flex items-center justify-center font-medium py-[7px] rounded-sm max-w-max px-[10px] text-[14px]"
                  style={{
                    backgroundColor: bgColor,
                    color: color,
                  }}
                >
                  <Icon
                    icon={icon}
                    fontSize={
                      getAppointmentStatus(appointmentDetails) === "Confirmed"
                        ? 12
                        : 17
                    }
                    style={{ color: color, marginRight: "0.5rem" }}
                  />
                  <p>{getAppointmentStatus(appointmentDetails)}</p>
                </div>
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <p>Provider:</p>
                {appointmentDetails?.prov_first_name ? (
                  <UserProfile
                    firstName={appointmentDetails?.prov_first_name || ""}
                    lastName={appointmentDetails?.prov_last_name || ""}
                    profilePic={appointmentDetails?.prov_profile_pic || ""}
                    size="40"
                    fontSize={2.4}
                  />
                ) : (
                  "--/--"
                )}
              </div>
              <div className="col-span-1">
                Chair:{" "}
                <span className="text-[#717171]">
                  {appointmentDetails?.op_abbr
                    ? appointmentDetails?.op_abbr
                    : "--/--"}
                </span>
              </div>
            </div>
            <hr className=" border-dotted border-[#c8c8c8]" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 px-7 py-6 gap-10 text-base">
              <div className="col-span-1 flex items-center gap-2">
                <p>Patient:</p>
                {appointmentDetails?.pat_first_name ||
                appointmentDetails?.temp_details?.firstName ? (
                  <UserProfile
                    firstName={
                      appointmentDetails?.pat_first_name ||
                      appointmentDetails?.temp_details?.firstName ||
                      ""
                    }
                    lastName={
                      appointmentDetails?.pat_last_name ||
                      appointmentDetails?.temp_details?.lastName
                    }
                    profilePic={appointmentDetails?.pat_profile_pic || ""}
                    size="40"
                    fontSize={2.4}
                  />
                ) : (
                  "--/--"
                )}
              </div>

              <div className="col-span-1">
                New/Returning:{" "}
                <span className="text-[#717171]">
                  {appointmentDetails?.is_new_patient ? "New" : "Returning"}
                </span>
              </div>
              <div className="col-span-1">
                Phone:{" "}
                <span className="text-[#717171]">
                  {appointmentDetails?.pat_wireless_phone
                    ? appointmentDetails?.pat_wireless_phone
                    : appointmentDetails?.temp_details?.phone
                    ? appointmentDetails?.temp_details?.phone
                    : "--/--"}
                </span>
              </div>
              <div className="col-span-1">
                Email:{" "}
                <span className="text-[#717171]">
                  {appointmentDetails?.pat_email
                    ? appointmentDetails?.pat_email
                    : appointmentDetails?.temp_details?.email
                    ? appointmentDetails?.temp_details?.email
                    : "--/--"}
                </span>
              </div>

              <div className="col-span-1">
                Birthday:{" "}
                <span className="text-[#717171]">
                  {appointmentDetails?.pat_dob
                    ? appointmentDetails?.pat_dob
                    : appointmentDetails?.temp_details?.dob
                    ? appointmentDetails?.temp_details?.dob
                    : "--/--"}
                </span>
              </div>
              <div className="col-span-1">
                Referrer Name:{" "}
                <span className="text-[#717171]">
                  {appointmentDetails?.referrer_name
                    ? appointmentDetails?.referrer_name
                    : "--/--"}
                </span>
              </div>
              <div className="col-span-1">
                Note:{" "}
                <span className="text-[#717171]">
                  {appointmentDetails?.message
                    ? appointmentDetails?.message
                    : "--/--"}
                </span>
              </div>
            </div>
            <hr className=" border-dotted border-[#c8c8c8]" />
            <div className="flex items-center justify-start mt-5 gap-3 px-7">
              {activeTab === "approval-pending" && (
                <div className="flex items-center justify-center font-medium py-[8px] rounded-sm gap-2 max-w-max px-[15px] text-[16px] border">
                  <button
                    className="text-[#72B866] flex items-center justify-center"
                    onClick={() =>
                      handleUpdateAptStatus?.({
                        aptId: appointmentDetails?.id,
                        status: "accepted",
                      })
                    }
                  >
                    <Icon icon="charm:tick" width={20} height={20} />
                    Approve
                  </button>
                  <button
                    className="text-[#F47C7C] flex items-center justify-center"
                    onClick={() =>
                      handleUpdateAptStatus?.({
                        aptId: appointmentDetails?.id,
                        status: "declined",
                      })
                    }
                  >
                    <Icon icon="basil:cross-solid" width={30} height={30} />
                    Decline
                  </button>
                </div>
              )}
            </div>
            {appointmentDetails?.app_status &&
            appointmentDetails?.app_status === "Unsynced" ? (
              <>
                <hr className=" border-dotted border-[#c8c8c8]" />
                <form onSubmit={handleSubmit(onSubmit)}>
                  <ApptSlotBooking
                    appointmentDetails={appointmentDetails}
                    control={control}
                    watch={watch}
                    setValue={setValue}
                    register={register}
                    errors={errors}
                    date={appointmentDate}
                    setDate={setAppointmentDate}
                  />

                  <SheetFooter className="mt-6 p-4">
                    <SheetClose asChild>
                      <Button
                        className="bg-[#E0E0E0] font-normal text-sm text-gray-600 px-[60px] py-[25px] rounded-[7px] hover:bg-[#E0E0E0]"
                        type="button"
                        onClick={handleAppointmentDelete}
                      >
                        Delete
                      </Button>
                    </SheetClose>

                    {/* <SheetClose asChild> */}
                    <Button
                      className="bg-[#6995fe] font-normal text-sm text-white px-[60px] py-[25px] rounded-[7px] hover:bg-[#6995fe]"
                      type="submit"
                      disabled={
                        !bookingSlotDetails?.slotStart ||
                        !providerDetails?.provider_display_name
                      }
                    >
                      Submit
                    </Button>
                    {/* </SheetClose> */}
                  </SheetFooter>
                </form>
              </>
            ) : (
              ""
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default AppointmentDrawer;
