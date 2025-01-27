import SelectDropDown from "@/components/custom/SelectDropDown";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

type AppProps = {
  register: any;
  control: any;
  watch: any;
  setValue: any;
  setContent: (data: string) => void;
  textContent: any;
};
const TextTemplate = ({ register, control, watch, setValue }: AppProps) => {
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const { insertTextPlaceholderTypeOption } = watch();

  const handleValueInsert = (selectedOption: { id: string; label: string }) => {
    if (!selectedOption?.id) return;
    const selectedLabel = selectedOption?.id;
    if (!selectedLabel) return;
    const currentValue = watch("textBody") || "";

    // Update the value with the cursor position logic
    const newValue =
      cursorPosition === null
        ? currentValue + `{{${selectedLabel}}}` // Append if no cursor position
        : currentValue.slice(0, cursorPosition) +
          `{{${selectedLabel}}}` + // Insert at cursor position with {{}} wrapping it
          currentValue.slice(cursorPosition);
    setValue("textBody", newValue);
  };

  // Update the cursor position on selection or click
  const handleCursorPositionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCursorPosition(e.target.selectionStart);
  };

  return (
    <div>
      <div className="mt-3">
        <SelectDropDown
          name="insertTextPlaceholderType"
          options={insertTextPlaceholderTypeOption}
          control={control}
          selected="Insert placeholder type"
          handleOnchange={handleValueInsert}
          containerClassname="w-full"
        />
      </div>
      <Textarea
        id="textBody"
        placeholder=""
        {...register("textBody")}
        onSelect={handleCursorPositionChange} // Track cursor position
        onClick={handleCursorPositionChange} // Update cursor position on click
        className="p-4  border-2 text-md border-gray-300 rounded-2 h-32 mt-5 focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent"
      />
    </div>
  );
};

export default TextTemplate;
