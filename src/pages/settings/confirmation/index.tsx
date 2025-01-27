import {
  useAppointmentPmsConfirmationStatusQuery,
  useAppointmentPmsConfirmedStatusQuery,
  useAptPMSCnfStatusMutation,
  usePracticeConfirmationMutation,
} from "@/redux/practiceDashBoard/apiSlice";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ConfirmationPart1 from "./ConfirmationPart1";
import ConfirmationPart2 from "./ConfirmationPart2";
import { toast, ToastContainer } from "react-toastify";
import { PracticeSettingsDetailsDataType } from "@/types/settings";
import { RootState } from "@/redux/store";

type AppProps = {
  generalDetailsData: PracticeSettingsDetailsDataType;
};

const Confirmation = ({ generalDetailsData }: AppProps) => {
  const [confirmationStatusOption, setConfirmationStatusOption] = useState([]);

  //getting data from redux
  const persistPracticeId = useSelector(
    (state: RootState) => state?.persisted?.practice?.persistPracticeDetails?.id
  );

  //Api call
  const { data: appointmentPmsConfirmationStatus = {} } =
    useAppointmentPmsConfirmationStatusQuery(
      {
        practiceId: persistPracticeId,
      },
      { skip: !persistPracticeId }
    );
  const { data: appointmentPmsConfirmedData = {} } =
    useAppointmentPmsConfirmedStatusQuery(
      {
        practiceId: persistPracticeId,
      },
      { skip: !persistPracticeId }
    );

  const [aptPMSCnfStatus] = useAptPMSCnfStatusMutation();
  const [practiceConfirmation] = usePracticeConfirmationMutation();

  const handleSubmitAptPMSCnfStatus = async (data: any) => {
    try {
      const result: any = await aptPMSCnfStatus({
        ...data,
        practiceId: persistPracticeId,
      }).unwrap();
      if (result?.success) {
        toast.success(result?.message);
      }
    } catch (error: any) {
      toast.success(error?.message);
    }
  };

  const handleSubmitPracticeConfirmation = async (data: any) => {
    try {
      const result: any = await practiceConfirmation({
        ...data,
        practiceId: persistPracticeId,
      }).unwrap();
      if (result?.success) {
        toast.success(result?.message);
      }
    } catch (error: any) {
      toast.success(error?.message);
    }
  };

  useEffect(() => {
    if (appointmentPmsConfirmationStatus?.result?.length) {
      const filterData = appointmentPmsConfirmationStatus?.result?.map(
        (status: any) => {
          return {
            id: status?.id,
            label: status?.pms_item_name,
          };
        }
      );
      setConfirmationStatusOption(filterData);
    }
  }, [appointmentPmsConfirmationStatus?.result]);

  return (
    <div id="confirmations" className="p-[25px] w-full xl:w-1/2 max-w-[900px]">
      <ConfirmationPart1
        appointmentPmsConfirmedData={appointmentPmsConfirmedData?.result}
        confirmationStatusOption={confirmationStatusOption}
        handleSubmitAptPMSCnfStatus={handleSubmitAptPMSCnfStatus}
      />
      <hr className="border-t-2 border-dotted border-gray-300 mt-5" />
      <ConfirmationPart2
        generalDetailsData={generalDetailsData}
        confirmationStatusOption={confirmationStatusOption}
        handleSubmitPracticeConfirmation={handleSubmitPracticeConfirmation}
      />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Confirmation;
