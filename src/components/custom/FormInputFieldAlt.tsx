import { UseFormRegister } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

//type for component props

type FieldProps = {
  register: UseFormRegister<any>;
  type: string;
  placeholder: string;
  fieldName: string;
  labelName?: string;
  inputClassName?: string;
  maxLength?: number;
  labelClassName?: string;
  readOnlyField?: boolean;
  required?: boolean;
  regex?: RegExp;
  labelSecondary?: string;
  containerClassName?: string; // Regex for filtering input
  labelContainerClassName?: string; // Regex for filtering input
  onFocus?: any;
  onBlur?: any;
  onPaste?: any;
  tooltipContent?: string;
  addIcon?: string;
};

//***Main Export Function***

export default function FormInputFieldAlt({
  register,
  type,
  placeholder,
  fieldName,
  labelName,
  readOnlyField,
  required,
  inputClassName,
  labelClassName,
  maxLength,
  regex,
  labelSecondary,
  containerClassName,
  labelContainerClassName,
  onFocus,
  onBlur,
  onPaste,
  tooltipContent,
  addIcon,
}: FieldProps) {
  return (
    <div className={cn("container-div ", containerClassName)}>
      <div className={cn("", labelContainerClassName)}>
        {addIcon ? (
          <Icon icon={addIcon} className="text-gray-500 size-[20px]" />
        ) : (
          ""
        )}
        <Label
          htmlFor={fieldName}
          className={cn("font-medium text-gray-600", labelClassName)}
        >
          {labelName}
          {labelSecondary && (
            <span className="block font-normal text-[.9em] mt-[3px]">
              {labelSecondary}
            </span>
          )}
        </Label>

        {tooltipContent?.trim() && tooltipContent?.trim().length > 0 ? (
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
                {tooltipContent}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}
      </div>
      <Input
        {...register(fieldName, {
          required: required ? `${labelName} is required` : false,
        })}
        type={type}
        id={fieldName}
        className={cn(inputClassName)}
        tabIndex={0}
        placeholder={placeholder}
        disabled={readOnlyField}
        maxLength={maxLength}
        onInput={(e) => {
          if (regex) {
            const target = e.target as HTMLInputElement;
            // Apply regex replace to filter unwanted characters
            target.value = target.value.replace(new RegExp(regex), "");
          }
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        onPaste={onPaste}
      />
    </div>
  );
}
