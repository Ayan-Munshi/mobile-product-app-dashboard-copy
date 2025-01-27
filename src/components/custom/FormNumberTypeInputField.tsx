import { UseFormRegister } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

// Define the prop types for the component
type FieldProps = {
  register: UseFormRegister<any>;
  type: string;
  placeholder: string;
  fieldName: string;
  labelName: string;
  className?: string;
  readOnlyField?: boolean;
  required?: boolean;
  maxLength?: number;
  labelClassName?: string;
};

export default function FormNumberTypeInputField({
  register,
  type,
  placeholder,
  fieldName,
  labelName,
  readOnlyField,
  required,
  maxLength,
  className,
  labelClassName,
}: FieldProps) {
  return (
    <>
      <Label
        htmlFor={fieldName}
        className={cn("font-medium text-gray-600", labelClassName)}
      >
        {labelName}
      </Label>
      <Input
        {...register(fieldName, {
          required: required ? `${labelName} is required` : false,
        })}
        maxLength={maxLength}
        type={type}
        className={className}
        placeholder={placeholder}
        disabled={readOnlyField}
        onInput={(e) => {
          // Type assertion to ensure e.target is an HTMLInputElement
          const target = e.target as HTMLInputElement;
          // Remove non-numeric characters
          target.value = target.value.replace(/[^0-9]/g, "");
        }}
      />
    </>
  );
}
