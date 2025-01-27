import DynamicCheckBoxDropDown from "@/components/custom/DynamicCheckBoxDropDown";
import { Typography } from "@/components/custom/Typography";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import _ from "lodash";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type AppProps = {
  confirmationStatusOption: { id: string; label: string }[];
  handleSubmitAptPMSCnfStatus: (data: any) => void;
  appointmentPmsConfirmedData: any;
};

const ConfirmationPart1 = ({
  confirmationStatusOption,
  handleSubmitAptPMSCnfStatus,
  appointmentPmsConfirmedData,
}: AppProps) => {
  const [isObjectValueChange, setIsObjectValueChange] =
    useState<boolean>(false);
  const { control, watch, handleSubmit, setValue } = useForm({
    defaultValues: {
      aptConfirmationStausIds: [],
    },
  });

  const filterData = appointmentPmsConfirmedData?.map((data: any) => data?.id);
  useEffect(() => {
    if (appointmentPmsConfirmedData?.length) {
      setValue("aptConfirmationStausIds", filterData);
    }
  }, [appointmentPmsConfirmedData]);
  const watchedValue = watch();

  useEffect(() => {
    const isEqual = _.isEqual(
      filterData,
      watchedValue?.aptConfirmationStausIds
    ); // Deep comparison
    setIsObjectValueChange(isEqual);
  }, [watchedValue, filterData]);

  return (
    <>
      <Typography as="h1" className="text-xl text-[#535353] font-medium">
        PMS Settings
      </Typography>
      <form
        className="ml-1"
        onSubmit={handleSubmit(handleSubmitAptPMSCnfStatus)}
      >
        <Typography as="h2" className="text-[18px] mt-6 font-medium">
          Confirm Status(es)
        </Typography>
        <Typography as="p" className="text-[16px] text-gray-400 mt-2">
          Select the statuses representing confirmed appointments.
        </Typography>

        <div className="mt-5 max-w-[318px]">
          <Controller
            name="aptConfirmationStausIds"
            control={control}
            defaultValue={[]} // Ensure default value is an array
            render={({ field }) => (
              <DynamicCheckBoxDropDown
                name="aptConfirmationStausIds"
                control={control}
                options={confirmationStatusOption}
                label={`${field.value?.length || 0} Selected`}
                // onChange={(value) => field.onChange(value)} // Ensure onChange works correctly
              />
            )}
          />
        </div>

        <div className="mt-8 flex justify-end w-full">
          <Button
            type="submit"
            className="bg-[#6995fe] flex gap-1 font-normal text-md text-white h-[49px] py-1 px-7 rounded-[7px] hover:bg-[#6995fe]"
            disabled={isObjectValueChange}
          >
            <Icon icon="mingcute:save-line" className="text-white" />
            Save
          </Button>
        </div>
      </form>
    </>
  );
};

export default ConfirmationPart1;
