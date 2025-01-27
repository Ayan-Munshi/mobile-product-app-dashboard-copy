import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GenralProvidersFormSetting from "./GenralProvidersFormSetting";
import { useSelector } from "react-redux";
import _ from "lodash";
import SkeletonGenralProvidersFormSetting from "@/components/custom/skeletons/SkeletonGenralProvidersFormSetting";
import Skeleton from "react-loading-skeleton";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdvanceProvidersFormSetting from "./AdvanceProvidersFormSetting";
import SkeletonAdvanceProvidersFormSetting from "@/components/custom/skeletons/SkeletonAdvanceProvidersFormSetting";

type TimeSlot = {
  start: string;
  end: string;
};

type DaySchedule = {
  is_day_available: boolean;
  times: TimeSlot[];
};

type InputDays = {
  [day: string]: {
    is_day_available: boolean;
    times: string[];
    isOpen: boolean;
  };
};

type OutputData = {
  [day: string]: DaySchedule;
};

export type InputFormValuesType = {
  providerDisplayName: string;
  role: { id: string; label: string };
  bio: string | null;
  operatories: number[];
  gender: string;
  activeReason: boolean;
  providerProfile: string | null;
  providerFile: File | null;
};

type FormDataType = {
  display_name?: string;
  role?: string;
  bio?: string;
  operatories?: { operatory_id: number }[];
  gender?: string;
  is_active?: boolean;
  profile_pic?: string;
};

type AppProps = {
  open: boolean;
  fetching: boolean;
  type: string;
  onClose: () => void;
  handleAddReason?: (data: ProvidersFormValues) => void;
  handleProviderUpdate?: (data: ProvidersFormValues & { id: string }) => void;
  handleProviderBlockoutUpdate: (data: any) => void;
  formData: any;
  // handleCheckUncheckOperatoriesToast: () => void;
};

export type ProvidersFormValues = {
  providerDisplayName: string;
  bio: string;
  role: { id: string; label: string };
  providerProfile: any;
  gender: string;
  operatories: any[];
};

const EditProvidersDetails = ({
  open,
  onClose,
  type,
  handleAddReason,
  handleProviderUpdate,
  formData,
  fetching,
  handleProviderBlockoutUpdate,
}: AppProps) => {
  // Genral providers form hook-form
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    register,
  } = useForm<InputFormValuesType>({
    defaultValues: {
      providerDisplayName: "",
      bio: "",
      operatories: [],
      gender: "",
      role: { id: "", label: "" },
      providerProfile: null,
      providerFile: null,
    },
  });

  // Advance provider's hook form
  const {
    control: advanceControl,
    watch: advanceWatch,
    setValue: advanceSetValue,
    handleSubmit: advanceHandleSubmit,
    register: advanceRegister,
  } = useForm({
    defaultValues: {
      days: {
        Sunday: { is_day_available: true, times: [] },
        Monday: { is_day_available: true, times: [] },
        Tuesday: { is_day_available: true, times: [] },
        Wednesday: { is_day_available: true, times: [] },
        Thursday: { is_day_available: true, times: [] },
        Friday: { is_day_available: true, times: [] },
        Saturday: { is_day_available: true, times: [] },
      },
      allowScheduleOverlap: true,
    },
  });

  const popupRef = useRef<HTMLDivElement | null>(null);
  const [comparedObject, setComparedObject] = useState<any>({});
  const [isObjectValueChange, setIsObjectValueChange] =
    useState<boolean>(false);
  const persistPracticeId = useSelector(
    (state: any) => state?.persisted?.practice?.persistPracticeDetails?.id
  );

  const watchedValue = watch();

  useEffect(() => {
    const isEqual = _.isEqual(comparedObject, watchedValue); // Deep comparison
    setIsObjectValueChange(isEqual);
  }, [watchedValue, comparedObject]);

  // For comparison or further processing
  useEffect(() => {
    if (formData) {
      const updatedObject = handleSetFormDataValue(formData);
      setComparedObject({ ...updatedObject, providerFile: null });
    }
  }, [formData]);

  useEffect(() => {
    if (formData) {
      setValue("providerDisplayName", formData?.display_name || "");
      setValue("role", { id: formData.role, label: formData.role });
      setValue("bio", formData.bio);
      setValue(
        "operatories",
        formData?.operatories
          ? formData?.operatories?.map(
              (operatorie: any) => operatorie?.operatory_id
            )
          : []
      );
      setValue("gender", formData?.gender);
      setValue("providerProfile", formData?.profile_pic);
      advanceSetValue(
        "days",
        formData?.timeoffs["Sunday"]
          ? formData?.timeoffs
          : {
              Sunday: { is_day_available: true, times: [] },
              Monday: { is_day_available: true, times: [] },
              Tuesday: { is_day_available: true, times: [] },
              Wednesday: { is_day_available: true, times: [] },
              Thursday: { is_day_available: true, times: [] },
              Friday: { is_day_available: true, times: [] },
              Saturday: { is_day_available: true, times: [] },
            }
      );
      advanceSetValue(
        "allowScheduleOverlap",
        formData?.allow_schedule_overlap === false ? false : true
      );
    }
  }, [formData]);

  const onSubmit = (data: any) => {
    type === "Edit"
      ? handleProviderUpdate?.({
          ...data,
          file: watchedValue?.providerFile,
          providorId: formData?.id,
          practiceId: persistPracticeId,
        })
      : handleAddReason?.(data);
    onClose();
  };

  function handleSetFormDataValue(formData: FormDataType | null) {
    if (!formData) return;

    // Create an updated state object
    const updatedState: Partial<InputFormValuesType> = {
      providerDisplayName: formData?.display_name || "",
      role: formData?.role
        ? { id: formData.role, label: formData.role }
        : { id: "", label: "" },
      bio: formData.bio || null,
      operatories: formData?.operatories
        ? formData?.operatories.map((operatorie) => operatorie?.operatory_id)
        : [],
      gender: formData?.gender || "",
      activeReason: formData?.is_active ?? false,
      providerProfile: formData?.profile_pic || null,
    };

    // Dynamically update form values using React Hook Form's setValue
    (
      Object.entries(updatedState) as [keyof InputFormValuesType, any][]
    ).forEach(([key, value]) => {
      if (value !== undefined) {
        setValue(key, value);
      }
    });

    return updatedState;
  }

  const handleCheckUncheckOperatoriesToast = () => {
    toast.error("Operatories mapped with reason for visit", {
      containerId: "popup-toast", // Unique ID for the container
    });
  };

  const convertTimeFormat = (timeRange: string): TimeSlot => {
    const [start, end] = timeRange.split(" - ").map((time) => {
      const [hour, period] = time.split(" ");
      let [hours, minutes] = hour.split(":").map(Number);
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:00`;
    });
    return { start, end };
  };

  const transformData = (input: { days: InputDays }): { data: OutputData } => {
    const output: { data: OutputData } = { data: {} };

    for (const day in input.days) {
      const { is_day_available, times } = input.days[day];
      const convertedTimes = times.map(convertTimeFormat);
      output.data[day] = { is_day_available, times: convertedTimes }; // This is now type-safe
    }

    return output;
  };

  const handleUpdateProviderBlockout = (data: any) => {
    const result = transformData(data);
    handleProviderBlockoutUpdate?.({
      providerBlockoutData: result?.data,
      allowScheduleOverlap: data?.allowScheduleOverlap,
      providorId: formData?.id,
      practiceId: persistPracticeId,
    });
    onClose();
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* <DialogContent className="max-w-[min(75%,1050px)] min-h-[75vh] content-start border p-10 overflow-y-auto max-h-screen [&>button]:hidden focus-visible:outline-none focus-visible:ring-0 "> */}
      <DialogContent
        ref={popupRef}
        className="max-w-[min(75%,1050px)] content-start border [&>button]:hidden p-0 min-h-[700px]"
      >
        <DialogHeader className="flex justify-between px-7 py-3 mt-4">
          <DialogTitle className="focus-visible:ring-transparent font-medium  ">
            Edit Provider :{" "}
            <span className="text-blue-700 ml-2">
              {fetching ? (
                <Skeleton height={20} width="15%" containerClassName="flex-1" />
              ) : (
                `${formData?.pms_first_name} ${formData?.pms_last_name} (${formData?.pms_prov_num})`
              )}
            </span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full mt-3 ">
          <div className="w-full flex border-b-2">
            <TabsList className="grid  grid-cols-3  h-11 bg-transparent text-gray-700 gap-6 px-6">
              <TabsTrigger
                value="general"
                className="relative max-w-[99px] text-[16px]  h-[42px]  data-[state=active]:after:content-[''] data-[state=active]:after:absolute  data-[state=active]:after:bottom-0 data-[state=active]:after:w-full data-[state=active]:after:h-[3px] data-[state=active]:after:bg-[#2260EE]  "
              >
                General
              </TabsTrigger>
              <TabsTrigger
                value="advance"
                className="relative max-w-[99px] text-[16px]  h-[42px]  data-[state=active]:after:content-[''] data-[state=active]:after:absolute  data-[state=active]:after:bottom-0 data-[state=active]:after:w-full data-[state=active]:after:h-[3px] data-[state=active]:after:bg-[#2260EE]  "
              >
                Advanced
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent
            value="general"
            className="focus-visible:ring-transparent ring-offset-[transparent] mt-0"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              id="form"
              className="grid grid-cols-12 gap-y-10 mt-0  px-10 "
            >
              {fetching ? (
                <div className=" col-span-12 max-w-full">
                  <SkeletonGenralProvidersFormSetting />
                </div>
              ) : (
                <>
                  <GenralProvidersFormSetting
                    control={control}
                    register={register}
                    errors={errors}
                    watch={watch}
                    setValue={setValue}
                    formData={formData}
                    handleCheckUncheckOperatoriesToast={
                      handleCheckUncheckOperatoriesToast
                    }
                  />

                  <div className="flex justify-end gap-4  col-start-9 col-end-13 max-w-full">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        className="bg-[#eaeaec] text-gray-700 text-md font-normal hover:bg-[#eaeaec] px-9 py-1 rounded-[7px]"
                      >
                        Discard
                      </Button>
                    </DialogClose>
                    <Button
                      className="bg-[#6995fe] font-normal text-md text-white px-9 py-1 rounded-[7px] hover:bg-[#6995fe]"
                      type="submit"
                      disabled={isObjectValueChange}
                    >
                      Save
                    </Button>
                  </div>
                </>
              )}
            </form>
          </TabsContent>

          <TabsContent value="advance">
            <form
              onSubmit={advanceHandleSubmit(handleUpdateProviderBlockout)}
              id="form"
              className="grid grid-cols-12 gap-y-3 mt-5  mb-[30px] px-10 items-center"
            >
              {fetching ? (
                <div className=" col-span-12 max-w-full">
                  <SkeletonAdvanceProvidersFormSetting />
                </div>
              ) : (
                <>
                  <AdvanceProvidersFormSetting
                    control={advanceControl}
                    setValue={advanceSetValue}
                    watch={advanceWatch}
                    register={advanceRegister}
                  />

                  <div className="flex justify-end gap-4  col-span-12 max-w-full">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        className="bg-[#eaeaec] text-gray-700 text-md font-normal hover:bg-[#eaeaec] px-9 py-1 rounded-[7px]"
                      >
                        Discard
                      </Button>
                    </DialogClose>
                    <Button
                      className="bg-[#6995fe] font-normal text-md text-white px-9 py-1 rounded-[7px] hover:bg-[#6995fe]"
                      type="submit"
                      // disabled={isObjectValueChange}
                    >
                      Save
                    </Button>
                  </div>
                </>
              )}
            </form>
          </TabsContent>
        </Tabs>
        <ToastContainer
          containerId="popup-toast" // Unique ID for the popup ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditProvidersDetails;
