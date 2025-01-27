import * as Checkbox from "@radix-ui/react-checkbox";
import { ReactNode } from "react";

type AppProps = {
  item: { id: string; label: ReactNode };
  isChecked: boolean;
  onChange: () => void;
  className: string;
};

export default function FormCheckboxField({
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
      {item.label}
    </Checkbox.Root>
  );
}
