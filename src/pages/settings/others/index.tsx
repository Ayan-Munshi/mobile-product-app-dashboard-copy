import SelectDropDown from "@/components/custom/SelectDropDown";
import { Typography } from "@/components/custom/Typography";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useUpdateOthersSettingDataMutation,
  useUpdatePracticeDataMutation,
} from "@/redux/practiceDashBoard/apiSlice";
import {
  OthersInputFormValuesType,
  PracticeSettingsDetailsDataType,
} from "@/types/settings";
import { Icon } from "@iconify/react/dist/iconify.js";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

const blockScheduleTypeOption = [
  { label: "All", id: "All" },
  { label: "Non scheduling", id: "NS" },
];

type AppProps = {
  generalDetailsData: PracticeSettingsDetailsDataType;
};

const OthersSetting = ({ generalDetailsData }: AppProps) => {
  const { handleSubmit, watch, setValue, register, control } =
    useForm<OthersInputFormValuesType>({
      defaultValues: {
        isAcceptingPatients: true,
        toVerifyPatient: true,
        toShowInsurances: true,
        useBlockScheduling: false,
        autoSyncAppointment: true,
        blockScheduleType: { id: "NS", label: "Non scheduling" },
      },
    });

  const [syncButtonName, setSyncButtonName] = useState("");
  const [comparedObject, setComparedObject] = useState<any>({});
  const [isObjectValueChange, setIsObjectValueChange] =
    useState<boolean>(false);
  const {
    isAcceptingPatients,
    toVerifyPatient,
    toShowInsurances,
    useBlockScheduling,
    blockScheduleType,
    autoSyncAppointment
  } = watch();
  const watchedValue = watch();
  // const { useBlockScheduling, blockScheduleType } = eventWatch();
  //getting data from redux
  const persistPracticeId = useSelector(
    (state: any) => state?.persisted?.practice?.persistPracticeDetails?.id
  );
  // API call
  const [updateOthersSettingData] = useUpdateOthersSettingDataMutation();
  // update practice data by sync button
  const [updatePracticeData, { isLoading: syncLoading }] =
    useUpdatePracticeDataMutation();

  useEffect(() => {
    const isEqual = _.isEqual(comparedObject, watchedValue);
    setIsObjectValueChange(isEqual);
  }, [watchedValue, comparedObject]);

  // For comparison or further processing
  useEffect(() => {
    if (generalDetailsData?.id) {
      const updatedObject = handleSetFormDataValue(generalDetailsData);
      setComparedObject(updatedObject);
    }
  }, [generalDetailsData, open]);

  const handleOthersFormSubmit = async () => {
    try {
      const finalData = {
        isAcceptingPatients,
        toVerifyPatient,
        toShowInsurances,
        useBlockScheduling,
        blockScheduleType,
        autoSyncAppointment,
        practiceId: persistPracticeId,
      };
      const result: any = await updateOthersSettingData(finalData).unwrap();
      if (result?.success) {
        toast.success(result?.message || "Updated successfully!");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to Update");
    }
  };

  function handleSetFormDataValue(formData: Partial<any>) {
    const initialObject: Partial<OthersInputFormValuesType> = {
      isAcceptingPatients:
        formData?.is_accepting_patients === false ? false : true,
      toVerifyPatient: formData?.to_verify_patient === false ? false : true,
      toShowInsurances: formData?.to_show_insurances === false ? false : true,
      autoSyncAppointment: formData?.auto_sync_appointment === false ? false : true,
      useBlockScheduling:
        formData?.use_block_scheduling === false ? false : true,
      blockScheduleType: {
        id: formData?.block_schedule_type || "",
        label:
          formData?.block_schedule_type === "NS"
            ? "Non scheduling"
            : formData?.block_schedule_type || "",
      },
    };

    Object.entries(initialObject).forEach(([key, value]) => {
      if (value !== undefined) {
        setValue(key as keyof OthersInputFormValuesType, value);
      }
    });
    return initialObject;
  }

  const handleSyncSchedule = async () => {
    try {
      const finalData = {
        practiceId: persistPracticeId,
        module: "schedule",
      };
      setSyncButtonName("schedule");
      const result = await updatePracticeData(finalData).unwrap();
      if (result?.success) {
        toast.success(result?.message || "Synced successfully!");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update");
    }
  };

  const handleSyncOthers = async () => {
    try {
      const finalData = {
        practiceId: persistPracticeId,
        module: "others",
      };
      setSyncButtonName("others");
      const result = await updatePracticeData(finalData).unwrap();
      if (result?.success) {
        toast.success(result?.message || "Synced successfully!");
      } else {
        toast.error("Failed to update");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update");
    }
  };

  return (
    <div className="p-6 grid grid-cols-12">
      <form
        id="others"
        className="col-span-6"
        onSubmit={handleSubmit(handleOthersFormSubmit)}
      >
        <div className=" flex gap-2 items-center mt-5 text-white ">
          <Checkbox
            id="isAcceptingPatients"
            {...register("isAcceptingPatients")}
            checked={isAcceptingPatients}
            onCheckedChange={(checked: any) =>
              setValue("isAcceptingPatients", checked)
            }
            className="data-[state=checked]:bg-blue-700 border-[#55575a] data-[state=checked]:border-blue-700"
          />

          <Label
            htmlFor="isAcceptingPatients"
            className="text-md text-gray-700 font-normal cursor-pointer"
          >
            Accepting patients
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild className="">
                <Icon
                  icon="material-symbols:info-outline-rounded"
                  width="17"
                  height="17"
                  className="text-gray-400 cursor-pointer"
                />
              </TooltipTrigger>
              <TooltipContent className="text-[14px] font-[300] bg-gray-600 text-white max-w-[250px]">
                If turned off, patients will see a message: "This practice is
                not currently taking any appointments."
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex gap-2 items-center mt-5 text-white">
          <Checkbox
            id="toVerifyPatient"
            {...register("toVerifyPatient")}
            checked={toVerifyPatient}
            onCheckedChange={(checked: any) =>
              setValue("toVerifyPatient", checked)
            }
            className="data-[state=checked]:bg-blue-700 border-[#55575a] data-[state=checked]:border-blue-700"
          />

          <Label
            htmlFor="toVerifyPatient"
            className="text-md text-gray-700 font-normal cursor-pointer"
          >
            Verify patient's email or phone number
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Icon
                  icon="material-symbols:info-outline-rounded"
                  width="17"
                  height="17"
                  className="text-gray-400 cursor-pointer"
                />
              </TooltipTrigger>
              <TooltipContent className="text-[14px] font-[300] bg-gray-600 text-white max-w-[290px]">
                If turned on, patients will have to verify their email and phone
                number through OTP.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex gap-2 items-center mt-5 text-white">
          <Checkbox
            id="toShowInsurances"
            {...register("toShowInsurances")}
            checked={toShowInsurances}
            onCheckedChange={(checked: any) =>
              setValue("toShowInsurances", checked)
            }
            className="data-[state=checked]:bg-blue-700 border-[#55575a] data-[state=checked]:border-blue-700"
          />

          <Label
            htmlFor="toShowInsurances"
            className="text-md text-gray-700 font-normal cursor-pointer"
          >
            Ask patients for their insurance information
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Icon
                  icon="material-symbols:info-outline-rounded"
                  width="17"
                  height="17"
                  className="text-gray-400 cursor-pointer"
                />
              </TooltipTrigger>
              <TooltipContent className="text-[14px] font-[300] bg-gray-600 text-white max-w-[290px]">
                If turned on, patients will be prompted to enter their insurance
                information.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex gap-2 items-center mt-5 text-white">
          <Checkbox
            id="autoSyncAppointment"
            {...register("autoSyncAppointment")}
            checked={autoSyncAppointment}
            onCheckedChange={(checked: any) =>
              setValue("autoSyncAppointment", checked)
            }
            className="data-[state=checked]:bg-blue-700 border-[#55575a] data-[state=checked]:border-blue-700"
          />

          <Label
            htmlFor="autoSyncAppointment"
            className="text-md text-gray-700 font-normal cursor-pointer"
          >
            Auto Sync Appointment
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Icon
                  icon="material-symbols:info-outline-rounded"
                  width="17"
                  height="17"
                  className="text-gray-400 cursor-pointer"
                />
              </TooltipTrigger>
              <TooltipContent className="text-[14px] font-[300] bg-gray-600 text-white max-w-[290px]">
                If turned off, appointments will first appear in the action center from where they will have to be manually approved before they are synced to the pms.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-2 mt-5 text-white">
          <Checkbox
            id="useBlockScheduling"
            {...register("useBlockScheduling")}
            checked={useBlockScheduling}
            onCheckedChange={(checked: any) =>
              setValue("useBlockScheduling", checked)
            }
            className="data-[state=checked]:bg-blue-700 border-[#55575a] data-[state=checked]:border-blue-700"
          />

          <Label
            htmlFor="useBlockScheduling"
            className="text-md text-gray-700 font-normal cursor-pointer"
          >
            Enable block scheduling
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Icon
                  icon="material-symbols:info-outline-rounded"
                  width="17"
                  height="17"
                  className="text-gray-400 cursor-pointer"
                />
              </TooltipTrigger>
              <TooltipContent className="text-[14px] font-[300] bg-gray-600 text-white max-w-[290px] ">
                If this feature is enabled, patients will only see slots from
                dedicated blocks enabled for the reason for visit.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-2 mt-6">
          <Typography as="h2" className="text-[16px]  font-normal">
            Blockouts to remove
          </Typography>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Icon
                  icon="material-symbols:info-outline-rounded"
                  width="17"
                  height="17"
                  className="text-gray-400 cursor-pointer"
                />
              </TooltipTrigger>
              <TooltipContent className="text-[14px] font-[300] bg-gray-600 text-white max-w-[290px] ">
                Choose between blocking all or just non-scheduling blockouts.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="mt-5">
          <SelectDropDown
            name="blockScheduleType"
            control={control}
            options={blockScheduleTypeOption}
            selected={blockScheduleType?.label}
            disabled={useBlockScheduling}
          />
        </div>
        <div className="mt-5">
          <Button
            className="bg-[#6995fe] flex gap-1 font-normal text-md text-white h-[49px] py-1 px-7 rounded-[7px] hover:bg-[#6995fe]"
            type="submit"
            disabled={isObjectValueChange}
          >
            <Icon icon="mingcute:save-line" className="text-white" />
            Save
          </Button>
        </div>
      </form>
      <div className="flex gap-5 col-span-6">
        <button
          className="flex items-center justify-center gap-1 border-[1px] border-[#769FFD] py-2 px-1 rounded-[7px] h-[49px] w-[150px] bg-[#769FFD] text-white"
          onClick={handleSyncSchedule}
        >
          <Icon
            icon="uil:sync"
            className={`h-4 w-3.5 text-white mt-0.5 shrink-0 ${
              syncLoading && syncButtonName === "schedule"
                ? "animate-[spin_1s_linear_infinite_reverse]"
                : ""
            }`}
          />
          {syncLoading && syncButtonName === "schedule"
            ? "Syncing"
            : "Sync schedule"}
        </button>
        <button
          className="flex items-center justify-center gap-1 border-[1px] border-[#769FFD] py-2 px-1 rounded-[7px] h-[49px] w-[130px] bg-[#769FFD] text-white"
          onClick={handleSyncOthers}
        >
          <Icon
            icon="uil:sync"
            className={`h-4 w-3.5 text-white mt-0.5 shrink-0 ${
              syncLoading && syncButtonName === "others"
                ? "animate-[spin_1s_linear_infinite_reverse]"
                : ""
            }`}
          />
          {syncLoading && syncButtonName === "others"
            ? "Syncing"
            : "Sync others"}
        </button>
      </div>

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

export default OthersSetting;
