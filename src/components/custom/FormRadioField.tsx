import * as Checkbox from "@radix-ui/react-checkbox";
import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Typography } from "@/components/custom/Typography";

type AppProps = {
  item: { id: string; label: ReactNode };
  isChecked: boolean;
  onChange: () => void;
  className: string;
};

export default function FormRadioField({
  item,
  isChecked,
  onChange,
  className,
}: AppProps) {
  return (
    <Checkbox.Root
      className={className}
      checked={isChecked}
      onCheckedChange={onChange}
      id={item.id}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{item.label}</TooltipTrigger>
          <TooltipContent className="text-base font-normal bg-gray-600">
            <Typography as="p" className="text-white">
              {item.id}
            </Typography>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Checkbox.Root>
  );
}
