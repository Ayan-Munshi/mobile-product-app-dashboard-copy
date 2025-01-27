import { UseFormRegister } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

type FieldProps = {
  register: UseFormRegister<any>;
  type: string;
  placeholder: string;
  fieldName: string;
  labelName?: string;
  className?: string;
  maxLength?: number;
  labelClassName?: string;
  readOnlyField?: boolean;
  required?: boolean;
  regex?: RegExp; // Regex for filtering input
};

export default function FormInputField({
  register,
  type,
  placeholder,
  fieldName,
  labelName,
  readOnlyField,
  required,
  className,
  labelClassName,
  maxLength,
  regex,
}: FieldProps) {
  return (
    <>
      <Label
        htmlFor={fieldName}
        className={cn("font-medium text-gray-600 hello", labelClassName)}
      >
        {labelName}
      </Label>
      <Input
        {...register(fieldName, {
          required: required ? `${labelName} is required` : false,
        })}
        type={type}
        id={fieldName}
        className={cn(className)}
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
      />
    </>
  );
}
