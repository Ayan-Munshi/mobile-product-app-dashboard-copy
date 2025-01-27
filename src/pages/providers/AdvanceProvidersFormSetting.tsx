import DynamicCheckBoxDropDown from "@/components/custom/DynamicCheckBoxDropDown";
import { Typography } from "@/components/custom/Typography";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { providerBlockoutTimeSlots } from "@/constant/providerBlockoutTimeslotOption";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Control, Controller, UseFormRegister } from "react-hook-form";

type AppProps = {
  control: Control<any>;
  register: UseFormRegister<any>;
  //   errors: FieldErrors<any>;
  watch: () => any;
  setValue: any;
  //   formData: any;
  //   handleCheckUncheckOperatoriesToast: () => void;
};
const AdvanceProvidersFormSetting = ({
  control,
  register,
  watch,
  setValue,
}: AppProps) => {
  const { days, allowScheduleOverlap } = watch();
  return (
    <>
      <div className="col-start-1 col-end-5">
        <div className="flex items-center gap-2 text-white">
          <Checkbox
            id="terms"
            {...register("allowScheduleOverlap")}
            defaultChecked={allowScheduleOverlap}
            checked={allowScheduleOverlap}
            onCheckedChange={(checked: any) =>
              setValue("allowScheduleOverlap", checked)
            }
            className="data-[state=checked]:bg-blue-700 border-[#55575a] data-[state=checked]:border-blue-700"
          />

          <Label htmlFor="terms" className="text-md text-gray-700 font-normal">
            Allow provider schedule overlap
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
                Keep this feature on, if you want the provider to be available
                in multiple operatories at the same time.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {/* <Typography as="p" className="text-sm text-gray-400">
          Turn on checkbox to show provider on patient form
        </Typography> */}
      </div>
      <Typography
        as="p"
        className="col-start-1 col-end-3 text-md text-gray-700 font-normal mt-3"
      >
        Availability
      </Typography>
      <Typography
        as="p"
        className="col-start-6 col-end-9 text-md text-gray-700 font-normal"
      >
        Blocked Out Times
      </Typography>
      {Object.keys(days).map((day: any) => (
        <>
          <div className="col-start-1 col-end-3 flex items-center">
            <Controller
              name={`days.${day}.is_day_available`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => {
                    onChange(checked);
                  }}
                  className="bg-gray-200 data-[state=checked]:bg-blue-500 h-5 w-10 focus-visible:ring-transparent" // Track background colors
                  thumbClassName="bg-white" // Thumb color
                  thumbSize="h-4 w-4" // Custom thumb size
                />
              )}
            />
            <label className="text-sm font-medium ml-3">{day}</label>
          </div>
          <div className="col-start-4 col-end-5">Except</div>
          <div className="col-start-6 col-end-9">
            <Controller
              name={`days.${day}.times`}
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <DynamicCheckBoxDropDown
                  name={`days.${day}.times`}
                  control={control}
                  options={providerBlockoutTimeSlots}
                  label={`${
                    field.value?.length
                      ? `${field.value?.length} Selected`
                      : "None"
                  }`}
                />
              )}
            />
          </div>
        </>
      ))}
    </>
  );
};

export default AdvanceProvidersFormSetting;
