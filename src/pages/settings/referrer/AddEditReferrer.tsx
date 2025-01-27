import FormInputFieldAlt from "@/components/custom/FormInputFieldAlt";
import SelectDropDown from "@/components/custom/SelectDropDown";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { referrerSourceType } from "@/constant/referrer";
type AppProps = {
  open: boolean;
  watch: any;
  register: any;
  control: any;
  formType: string;
  onClose: () => void;
  handleSubmit: () => void;
  // formData: FormDataType;
  // handleReasonUpdate: (data: CreateReasonPayload) => void;
  // handleCreateReason: (data: UpdateReasonPayload) => void;
};

const AddEditReferrer = ({
  open,
  onClose,
  register,
  control,
  watch,
  formType,
  handleSubmit,
}: AppProps) => {
  const { sourceType, referrerName } = watch();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{formType} Referrer</DialogTitle>
          {/* <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription> */}
        </DialogHeader>
        {/* <div className="grid grid-cols-12 gap-4 py-4"> */}
        <div className="mt-10">
          <FormInputFieldAlt
            register={register}
            type="text"
            placeholder="Enter referrer name..."
            fieldName="referrerName"
            labelName="Referrer Name"
            required={true}
            labelClassName="text-md text-gray-700 font-normal required-field"
            inputClassName="h-[54px] pl-2 pr-2 text-md mt-2 border-2 border-gray-200 rounded-[7px] focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent"
            labelContainerClassName=" w-full flex gap-3 items-center"
            containerClassName=" w-full "
          />
        </div>
        <div className="w-full mt-3">
          <Label className="flex items-center font-medium text-[18px] mb-2">
            <span className="text-gray-700 font-normal text-md required-field">
              Source Type
            </span>
          </Label>
          <SelectDropDown
            name="sourceType"
            control={control}
            options={referrerSourceType}
            selected={sourceType?.label}
            containerClassname={"w-full"}
          />
        </div>
        {/* </div> */}
        <DialogFooter className="mt-5">
          <Button
            className="border bg-[#769FFD] hover:bg-[#769FFD] border-[#769FFD] rounded-[7px] min-w-[110px] min-h-12 text-[18px] items-center"
            type="submit"
            onClick={handleSubmit}
            disabled={!sourceType?.id || !referrerName?.trim()}
          >
            {formType === "Edit" ? "Save" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditReferrer;
