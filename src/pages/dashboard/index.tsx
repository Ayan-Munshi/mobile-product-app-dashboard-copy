import { Typography } from "@/components/custom/Typography";
import { useEffect, useState } from "react";
import AppointmentTable from "../appointments/AppointmentTable";
import {
  useGetAppointmentListQuery,
  useGetAppointmentStatusDataQuery,
  useGetPatientStatusDataQuery,
} from "@/redux/practiceDashBoard/apiSlice";
import { useSelector } from "react-redux";
import PatientStatusPieChart from "./PatientStatusPieChart";
import AppointmentStatus from "./AppointmentStatus";
import Skeleton from "react-loading-skeleton";
// import { Typography } from "./custom/Typography";

import {
  appointmentBookingStatusOption,
  appointmentStatusDateOption,
} from "@/constant/appointmentStatusDateOption";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/redux/store";
import { AppointmentsDataType } from "@/types/dashboard";
import SelectDropDown from "@/components/custom/SelectDropDown";
import { useForm } from "react-hook-form";
import SkeletonAppointments from "@/components/custom/skeletons/SkeletonAppointments";
export type AppointmentDataType = {
  name: string;
  patient?: number;
  pv?: number;
  amt: number;
};

const PracticeDashboard = () => {
  const { control, watch } = useForm({
    defaultValues: {
      aptBookingDate: {
        id: appointmentStatusDateOption[0].id,
        label: appointmentStatusDateOption[0].label,
      },
      aptBookingStatus: {
        id: "1",
        label: "Booked through app",
      },
    },
  });
  const { aptBookingDate, aptBookingStatus } = watch();
  const [appointmentStatusData, setAppointmentStatusData] = useState<
    AppointmentDataType[]
  >([]);
  const persistPracticeDetails = useSelector(
    (state: RootState) => state?.persisted?.practice?.persistPracticeDetails
  );

  const [endDate] = useState(moment().format("YYYY-MM-DD"));
  const totalAppointment = appointmentStatusData?.reduce(
    (acc, v) => acc + (+v.amt || 0),
    0
  );

  // Get Appointment List
  const { data: appointmentList = [], isFetching } = useGetAppointmentListQuery(
    {
      practiceId: persistPracticeDetails?.id,
      offset: 0,
      limit: 5,
      bookedThroughUs: aptBookingStatus?.id,
    },
    {
      skip: !persistPracticeDetails?.id,
    }
  );
  const {
    data: getPatientStatusData = {
      result: { new_patients: "", returning_patients: "" },
    },
  } = useGetPatientStatusDataQuery(
    {
      practiceId: persistPracticeDetails?.id,
      startDate: moment()
        .subtract(aptBookingDate?.id, "days")
        .format("YYYY-MM-DD"),
      endDate: endDate,
      bookedThroughUs: aptBookingStatus?.id,
    },
    {
      skip: !persistPracticeDetails?.id,
    }
  );
  const {
    data: getAppointmentStatusData = { result: [] },
    isFetching: appointmentStatusLoading,
  } = useGetAppointmentStatusDataQuery(
    {
      practiceId: persistPracticeDetails?.id,
      startDate: moment()
        .subtract(aptBookingDate?.id, "days")
        .format("YYYY-MM-DD"),
      endDate: endDate,
      bookedThroughUs: aptBookingStatus?.id,
    },
    {
      skip: !persistPracticeDetails?.id,
    }
  );

  useEffect(() => {
    if (getAppointmentStatusData?.result.length) {
      const modifiedData = getAppointmentStatusData?.result?.map(
        (data: AppointmentsDataType) => {
          return {
            name: moment(data?.date).format("MMM D"),
            Appointment: +data.booked_appointments,
            amt: +data?.booked_appointments,
          };
        }
      );
      setAppointmentStatusData(modifiedData);
    }
  }, [getAppointmentStatusData?.result]);

  const navigate = useNavigate();

  /***/

  return (
    <div className="p-6 grid grid-cols-12 gap-5">
      <div className="headline  col-span-full grid-cols-12 grid mb-6 gap-5">
        {appointmentStatusLoading ? (
          <Skeleton width="100%" height={20} />
        ) : (
          <Typography
            as="h2"
            className="text-black font-medium text-[30px] col-start-1 col-end-7 leading-[1.2]"
          >
            <span className="text-[#072f8b] text-[20px]">Welcome back,</span>
            <br />
            {persistPracticeDetails?.name
              ? `${persistPracticeDetails.name}!`
              : ""}
          </Typography>
        )}
        <div className="col-start-9 col-end-11">
          <SelectDropDown
            name="aptBookingStatus"
            control={control}
            options={appointmentBookingStatusOption}
            selected={aptBookingStatus?.label}
          />
        </div>
        <div className="col-start-11 col-end-13">
          <SelectDropDown
            name="aptBookingDate"
            control={control}
            options={appointmentStatusDateOption}
            selected={aptBookingDate?.label}
          />
        </div>
      </div>

      {appointmentStatusLoading ? (
        // <div className="w-full">
        <Skeleton
          width="100%"
          height={400}
          containerClassName="col-start-1 col-end-9"
        />
      ) : (
        // </div>
        <div className="col-start-1 col-end-9 bg-white  h-[400px] relative py-7 pr-6 stroke rounded-[10px] border">
          <div className="w-full h-full">
            <div className="w-full flex justify-between mb-7 items-center">
              <Typography
                as="p"
                className="text-[#000000] font-medium text-base md:text-[20px] pl-10"
              >
                Appointment Data
              </Typography>
              <Typography
                as="p"
                className="text-[#000000] font-medium text-base md:text-base pl-10"
              >
                Total: {totalAppointment}
              </Typography>
            </div>
            <AppointmentStatus data={appointmentStatusData} />
          </div>
        </div>
      )}
      {/* Patients PieChart */}
      <div className=" col-start-9 col-end-13 bg-white p-7 flex flex-wrap border rounded-[10px]">
        <div className="w-full flex justify-between mb-7 items-center">
          <Typography
            as="p"
            className="text-[#000000] font-medium text-base md:text-[20px]"
          >
            Patient Type
          </Typography>
          <div className="lengend flex gap-6">
            <div className="flex gap-2 items-center">
              <span className="w-4 h-4 bg-[#2260ee]"></span>
              <span>New</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="w-4 h-4 bg-blue-200"></span>
              <span>Returning</span>
            </div>
          </div>
        </div>
        <div className="w-full flex items-center bg-slate-100 p-5 rounded-[10px]">
          <div className=" w-[40%] [@media(max-width:1480px)]:w-[45%]">
            <div className="flex gap-2">
              <span className=" block w-4 h-4 bg-[#2260ee]"></span>

              <p className="text-base mb-10">
                <span className="text-[35px] font-[600]">
                  {getPatientStatusData?.result?.new_patients}
                </span>
                <br />
                new patients
              </p>
            </div>
            <div className="flex gap-2">
              <span className=" block w-4 h-4 bg-blue-200"></span>

              <p className="text-base ">
                <span className="text-[35px] font-[600]">
                  {getPatientStatusData?.result?.returning_patients}
                </span>
                <br />
                returning patients
              </p>
            </div>
          </div>
          <div className=" w-[60%] [@media(max-width:1480px)]:w-[55%]">
            <PatientStatusPieChart patientData={getPatientStatusData} />
          </div>
        </div>
      </div>
      <div
        id="appointment-table-wrapper"
        className="bg-white p-5 col-span-12 mt-5 rounded-[10px] border"
      >
        <div className="flex justify-between flex-wrap items-center">
          <Typography
            as="h4"
            className="text-[#000000] font-medium text-[24px]"
          >
            Latest Appointments
          </Typography>
          <Button
            className="border bg-[#769FFD] hover:bg-[#769FFD] border-[#769FFD] rounded-[7px] min-w-[100px] min-h-10 text-base"
            onClick={() => navigate("/appointment-list")}
          >
            <Icon
              icon="hugeicons:view"
              style={{ color: "#fff" }}
              className="!w-4 !h-4"
            />
            View all
          </Button>
        </div>
        {isFetching ? (
          <SkeletonAppointments rows={5} />
        ) : (
          <AppointmentTable
            tableData={appointmentList?.result || []}
            className=" bg-white "
            type="dashboard"
          />
        )}
      </div>
    </div>
  );
};

export default PracticeDashboard;
