import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Control, Controller } from "react-hook-form";
type Appprops = {
  control: Control<any>;
  headerText: string;
  pmsProvName?: string;
  type?: string;
};

const PopupHeader = ({ control, headerText, pmsProvName, type }: Appprops) => {
  return (
    <DialogHeader className="flex-row justify-between px-9 py-6 leading-none align-middle items-center">
      <DialogTitle className="focus-visible:ring-transparent font-medium">
        {headerText}
        {pmsProvName ? (
          <>
            : <span className="text-blue-700">{pmsProvName}</span>
          </>
        ) : null}
      </DialogTitle>
      {type !== "add" && (
        <div>
          <span className="mr-4 font-medium text-[#3b3e4f]">Active</span>
          <Controller
            name="activeReason"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Switch
                checked={value} // Check if activeReason is 1
                onCheckedChange={(checked) => {
                  // Set activeReason to 1 if checked, otherwise 0
                  onChange(checked);
                }}
                className="bg-gray-200 data-[state=checked]:bg-blue-500 h-5 w-10 focus-visible:ring-transparent" // Track background colors
                thumbClassName="bg-white" // Thumb color
                thumbSize="h-4 w-4" // Custom thumb size
              />
            )}
          />
        </div>
      )}
    </DialogHeader>
  );
};

export default PopupHeader;
