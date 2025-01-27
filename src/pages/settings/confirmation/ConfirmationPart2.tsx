import DynamicRadio from "@/components/custom/DynamicRadio";
import SelectDropDown from "@/components/custom/SelectDropDown";
import { Typography } from "@/components/custom/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PracticeSettingsDetailsDataType } from "@/types/settings";
import { Icon } from "@iconify/react/dist/iconify.js";
import _ from "lodash";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
type AppProps = {
  confirmationStatusOption: { id: string; label: string }[];
  handleSubmitPracticeConfirmation: (data: any) => void;
  generalDetailsData: PracticeSettingsDetailsDataType;
};
const radioOption = ["Don’t send confirm prompt", "Send confirm prompt"];

const ConfirmationPart2 = ({
  generalDetailsData,
  confirmationStatusOption,
  handleSubmitPracticeConfirmation,
}: AppProps) => {
  const [isObjectValueChange, setIsObjectValueChange] =
    useState<boolean>(false);
  const [compareObj, setComparedObject] = useState({});
  const { control, watch, register, handleSubmit, setValue } = useForm({
    defaultValues: {
      confirmStatus: { id: "", label: "" },
      cancelStatus: { id: "", label: "" },
      confirmationText: "",
      confirmationTime: "",
    },
  });
  const watchedValue = watch();
  useEffect(() => {
    const isEqual = _.isEqual(compareObj, watchedValue); // Deep comparison
    setIsObjectValueChange(isEqual);
  }, [watchedValue, compareObj]);

  useEffect(() => {
    // if(generalDetailsData?.cancelled_status_id){
    const generalDetailsObject = {
      confirmStatus: {
        id: generalDetailsData?.confirmed_status_id,
        label: generalDetailsData?.confirmed_status_name,
      },
      cancelStatus: {
        id: generalDetailsData?.cancelled_status_id,
        label: generalDetailsData?.cancelled_status_name,
      },
      confirmationText: generalDetailsData?.to_send_text
        ? "Send confirm prompt"
        : !generalDetailsData?.to_send_text
        ? "Don’t send confirm prompt"
        : "",
      confirmationTime: generalDetailsData?.send_text_time || "",
    };

    (
      Object.entries(generalDetailsObject) as [
        keyof typeof generalDetailsObject,
        any
      ][]
    ).forEach(([key, value]) => {
      if (value !== undefined) {
        setValue(key, value);
      }
    });
    setComparedObject(generalDetailsObject);
    // setValue("confirmStatus", {
    //   id: generalDetailsData?.confirmed_status_id,
    //   label: generalDetailsData?.confirmed_status_name,
    // });
    // setValue("cancelStatus", {
    //   id: generalDetailsData?.cancelled_status_id,
    //   label: generalDetailsData?.cancelled_status_name,
    // });
    // setValue(
    //   "confirmationText",
    //   generalDetailsData?.to_send_text
    //     ? "Send confirm prompt"
    //     : !generalDetailsData?.to_send_text
    //     ? "Don’t send confirm prompt"
    //     : ""
    // );
    // setValue("confirmationTime", generalDetailsData?.send_text_time || "");
    // }
  }, [
    generalDetailsData?.confirmed_status_id,
    generalDetailsData?.cancelled_status_id,
    generalDetailsData?.to_send_text,
    generalDetailsData?.send_text_time,
  ]);
  const { confirmStatus, cancelStatus, confirmationText } = watch();
  return (
    <form onSubmit={handleSubmit(handleSubmitPracticeConfirmation)}>
      <Typography as="h2" className="text-[18px] mt-6 font-medium">
        All in One Dental Status
      </Typography>
      <Typography as="p" className="text-[16px] text-start text-gray-400 mt-2">
        Select the appointment status All in One Dental will set in your PMS
        when an appointment is:
      </Typography>
      <Typography as="h2" className="text-[16px] mt-6 font-normal">
        Confirmed In All in One Dental
      </Typography>
      <div className="mt-5">
        <SelectDropDown
          name="confirmStatus"
          control={control}
          options={confirmationStatusOption}
          selected={confirmStatus?.label}
        />
      </div>
      <Typography as="h2" className="text-[16px] mt-6 font-normal">
        Cancelled In All in One Dental
      </Typography>
      <div className="mt-5">
        <SelectDropDown
          name="cancelStatus"
          control={control}
          options={confirmationStatusOption}
          selected={cancelStatus?.label}
        />
      </div>
      <Typography as="h2" className="text-[18px] mt-6 font-medium">
        Confirmation Text
      </Typography>
      <Typography as="p" className="text-[16px] text-start text-gray-400 mt-2">
        When to send patient text to prompt for confirmation
      </Typography>

      <div className="mt-6">
        {radioOption.map((link, index) => (
          <Controller
            key={index}
            name="confirmationText"
            control={control}
            defaultValue="Don’t send confirm prompt"
            render={({ field }) => (
              <DynamicRadio
                text={link}
                index={index}
                selectedPractice={confirmationText}
                setValue={(value) => field.onChange(value)}
              />
            )}
          />
        ))}
      </div>

      <div className="ml-8 mt-8">
        <div className="flex gap-5 items-center ">
          <Input
            disabled={confirmationText === "Send confirm prompt" ? false : true}
            type="text"
            placeholder=""
            {...register("confirmationTime")}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              target.value = target.value.replace(/[^0-9]/g, "0");
            }}
            className="p-1 w-[50px] text-center text-md border-2 border-gray-300 rounded-[7px] focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent"
          />
          <Typography as="p" className="font-normal">
            hours before scheduled appointment time
          </Typography>
        </div>
      </div>
      <div className="mt-8 flex justify-end w-full">
        <Button
          type="submit"
          className="bg-[#6995fe] flex gap-1 font-normal text-md text-white h-[49px] px-7 py-1 rounded-[7px] hover:bg-[#6995fe]"
          disabled={isObjectValueChange}
        >
          <Icon icon="mingcute:save-line" className="text-white" />
          Save
        </Button>
      </div>
    </form>
  );
};

export default ConfirmationPart2;
