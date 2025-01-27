import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { usStateList } from "@/constant/usStateList";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import FormInputField from "@/components/custom/FormInputField";
import FormNumberTypeInputField from "@/components/custom/FormNumberTypeInputField";
import { useLazyVerifyCustomerKeyQuery } from "@/redux/practiceDashBoard/apiSlice";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import EmailValidation from "@/utils/EmailValidation";
import { Typography } from "@/components/custom/Typography";
import { getTimeZones } from "@vvo/tzdb";

type AppProps = {
  isOpen: boolean;
  onClose: () => void;
  addPractice: any;
  // setResponse: string;
};
export type PracticeFormType = {
  practiceName: string;
  practicePhone: string;
  practiceEmail: string;
  addressLine1: string;
  practiceCity: string;
  practiceState: string;
  practiceCountry: string;
  practiceZipCode: string;
  practiceDescription: string;
  odCustomerKey: string;
  // formURL: string;
  servertimeZone: string;
};

//*** Main return function
const AddPractice = ({ isOpen, onClose, addPractice }: AppProps) => {
  const {
    handleSubmit,
    register,
    watch,
    control,
    formState: { errors },
  } = useForm<PracticeFormType>({
    defaultValues: {
      practiceName: "",
      practicePhone: "",
      practiceEmail: "",
      addressLine1: "",
      practiceCity: "",
      practiceState: "",
      practiceCountry: "USA",
      practiceZipCode: "",
      practiceDescription: "",
      odCustomerKey: "",
      // formURL: "",
      servertimeZone: "",
    },
  });
  const {
    practiceName,
    practicePhone,
    practiceEmail,
    addressLine1,
    practiceCity,
    practiceState,
    practiceCountry,
    practiceZipCode,
    practiceDescription,
    odCustomerKey,
    // formURL: "",
    servertimeZone,
  } = watch();

  const [shouldVerify, setShouldVerify] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [filteredOptions, setFilteredOptions] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]); // Filtered options

  const timeZones = getTimeZones();

  // Format time zones for react-select
  const timeZoneList = timeZones.map((zone) => ({
    value: zone.name,
    label: zone.name,
  }));

  const [
    triggerVerifyCustomerKey,
    {
      isFetching: isVerifyLoading = false,
      error: verifyError,
      data: verifyCustomerKey = errors ? {} : {},
    },
  ] = useLazyVerifyCustomerKeyQuery();

  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      width: "100%", // Ensures full width
      borderRadius: "5px",
      borderWidth: "1px",
      borderColor: "#d1d5db",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#d1d5db", // Keep border color on hover
      },
      ...(state.isFocused && {
        borderColor: "#bfdbfe !important", // Focused state border color
      }),
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      display: "none", // Hide the dropdown indicator (arrow)
    }),
    indicatorSeparator: (base: any) => ({
      ...base,
      display: "none", // Remove the separator line
    }),
    indicatorContainer: (base: any) => ({
      ...base,
      display: "none", // Remove the entire indicator container
    }),
  };

  useEffect(() => {
    setIsSubmitDisabled(true);
  }, [odCustomerKey]);

  const handleCustomerKeyVerify = (e: any) => {
    e.preventDefault();
    setShouldVerify(true);
    setIsSubmitDisabled(false);
    triggerVerifyCustomerKey(odCustomerKey);
  };

  const handleFormSubmit = (data: any) => {
    addPractice(data);
    onClose();
  };

  // Handle change in input value (for filtering)
  const handleInputChange = (newInputValue: string) => {
    // setInputValue(newInputValue);

    // Only filter if the input is not empty
    if (newInputValue.trim() === "") {
      setFilteredOptions([]); // Clear options when input is empty
    } else {
      const filtered = timeZoneList.filter((option) =>
        option.label.toLowerCase().includes(newInputValue.toLowerCase())
      );
      setFilteredOptions(filtered); // Update filtered options
    }
  };

  // *** main return
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        id="drawerContent"
        className="overflow-y-auto  sm:max-w-[700px] rounded-[10px] p-0 [&_.absolute.right-4.top-4]:hidden"
      >
        <SheetHeader className="flex flex-row justify-between px-3">
          <div className="px-5 py-6 space-y-1 ">
            <SheetTitle className="text-xl font-medium text-[#373737]">
              Add new Practice
            </SheetTitle>
            <SheetDescription className="text-base">
              Each practice should have a unique PMS server.
            </SheetDescription>
          </div>
          <SheetClose className=" flex items-start  ">
            <Icon
              icon="maki:cross"
              className="text-gray-500 size-5 rounded-full border-2 border-gray-400 p-0.5 mt-5 "
            />
          </SheetClose>
        </SheetHeader>
        <hr className=" border-t-2 border-[#c8c8c8]" />
        <form className=" " onSubmit={handleSubmit(handleFormSubmit)}>
          {/** verify */}
          <div className="px-7 py-8 space-y-3">
            <p className="text-gray-500 text-base">
              Enter the key shared with you. The key must first be added to your
              OD server. Follow the instructions here. Kindly reach out to us if
              you dont have the key.
            </p>
            {/** input */}
            <div className="flex gap-2 ">
              <div className="relative">
                {/** verify's error */}
                <div className="absolute right-2 top-1">
                  {errors.odCustomerKey && (
                    <span className="text-red-500 text-sm">
                      {errors?.odCustomerKey?.message}
                    </span>
                  )}
                  {verifyCustomerKey?.message && (
                    <span
                      className={`${
                        verifyCustomerKey?.success
                          ? "text-green-500"
                          : "text-red-500"
                      } text-sm`}
                    >
                      {verifyCustomerKey?.message?.includes(
                        "Customer key verified successfully!"
                      ) ? (
                        !isSubmitDisabled ? (
                          <div className="flex items-center text-green-600 font-semibold gap-0.5">
                            <Icon icon="ix:success" className="size-4" />
                            Verified
                          </div>
                        ) : (
                          ""
                        )
                      ) : (
                        ""
                      )}
                    </span>
                  )}
                  {
                    // !isSubmitDisabled &&
                    verifyError && shouldVerify && verifyError?.message && (
                      <span className="text-red-500 text-sm">
                        {verifyError?.message?.includes(
                          "The office's eConnector is not running. Please contact the office to start their eConnector"
                        )
                          ? "turn on the eConnector"
                          : "Invalid secret key!"}
                      </span>
                    )
                  }

                  {shouldVerify && isVerifyLoading ? (
                    <div className="absolute right-2 ">
                      <svg
                        aria-hidden="true"
                        className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                <FormInputField
                  register={register}
                  type="text"
                  placeholder="MXDD234MK46"
                  fieldName="odCustomerKey"
                  labelName="OD key"
                  required={true}
                  labelClassName="text-base font-semibold	 text-gray-700 required-field"
                  className="py-6 mt-3 text-md border-[1px] border-gray-300 rounded-[5px] min-w-[286px]  focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent "
                />
              </div>
              <div className="flex items-end ">
                <Button
                  disabled={!isSubmitDisabled || !odCustomerKey} //this button disability will depend on the Submit button enability
                  onClick={(e: any) => handleCustomerKeyVerify(e)}
                  className=" w-[124px] h-[52px] bg-[#6995fe] font-normal text-md text-white px-5 py-1 rounded-[7px] hover:bg-[#6995fe] "
                >
                  Verify
                </Button>
              </div>
            </div>
          </div>
          <hr className=" border-dotted border-t-2 border-[#c8c8c8]" />
          {/** practice details */}
          <div className="px-7 py-8 ">
            <Typography as="h2" className="text-lg text-[#373737] font-medium">
              Enter practice details
            </Typography>
            <div className="grid grid-cols-2 gap-9 mt-7">
              <div className="cols-span-1">
                <FormInputField
                  register={register}
                  type="text"
                  placeholder="Enter Practice Name..."
                  fieldName="practiceName"
                  labelName="Practice Name"
                  required={true}
                  labelClassName="text-base font-semibold	 text-gray-700 required-field"
                  className=" py-6 mt-3 text-md border-[1px] border-[#CECECE] rounded-[5px]  focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent"
                />
                {errors.practiceName && (
                  <span className="text-red-500 text-sm">
                    {errors?.practiceName?.message}
                  </span>
                )}
              </div>
              <div className="cols-span-1">
                <FormNumberTypeInputField
                  register={register}
                  maxLength={10}
                  type="text"
                  placeholder="Enter Practice Phone..."
                  fieldName="practicePhone"
                  labelName="Practice Phone"
                  required={true}
                  labelClassName="text-base font-semibold	 text-gray-700 required-field"
                  className="py-6 mt-3 text-md border-[1px] border-[#CECECE] rounded-[5px]  focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent"
                />
                {errors?.practicePhone && (
                  <span className="text-red-500 text-sm">
                    {errors?.practicePhone?.message}
                  </span>
                )}
              </div>

              <div className="col-span-1">
                <FormInputField
                  register={register}
                  type="email"
                  placeholder="Enter practice email..."
                  fieldName="practiceEmail"
                  labelName="Practice Email"
                  required={true}
                  labelClassName="text-base font-semibold	 text-gray-700 required-field"
                  className="py-6 mt-3 text-md border-[1px] border-[#CECECE] rounded-[5px]  focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent"
                />
                {errors.practiceName && (
                  <span className="text-red-500 text-sm">
                    {errors?.practiceName?.message}
                  </span>
                )}
              </div>

              <div className="col-span-1 ">
                <Label className="text-base font-semibold	 text-gray-700 required-field">
                  Server Timezone
                </Label>
                <Controller
                  name="servertimeZone"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "Server Timestamp is required",
                    },
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={filteredOptions} // Use filtered options
                      styles={customStyles}
                      classNames={{
                        control: () =>
                          "py-[5px] mt-3 text-md border-[1px] border-[#CECECE] rounded-[3px] focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent",
                      }}
                      onInputChange={handleInputChange} // Capture input value for filtering
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption)
                      } // Update the field value
                      value={filteredOptions.find(
                        (option) => option.value === field.value
                      )} // Set the selected value
                      // inputValue={inputValue} // Controlled input value
                      placeholder="Example:America/Chicago..."
                      isSearchable
                      menuIsOpen={filteredOptions.length > 0}
                      // noOptionsMessage={() => "No time zones found"} // Message when no options are found
                    />
                  )}
                />

                {errors.servertimeZone && (
                  <span className="text-red-500 text-sm">
                    {errors?.servertimeZone?.message}
                  </span>
                )}
              </div>

              <div className="col-span-2">
                <FormInputField
                  register={register}
                  type="text"
                  placeholder="Enter your practice address..."
                  fieldName="addressLine1"
                  labelName="Street Address"
                  required={true}
                  labelClassName="text-base font-semibold	 text-gray-700 required-field"
                  className="py-6 mt-3 text-md border-[1px] border-[#CECECE] rounded-[5px]  focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent"
                />
                {errors.addressLine1 && (
                  <span className="text-red-500 text-sm">
                    {errors?.addressLine1?.message}
                  </span>
                )}
              </div>

              <div className="col-span-1">
                <FormInputField
                  register={register}
                  type="text"
                  placeholder="Enter your city..."
                  fieldName="practiceCity"
                  labelName="City"
                  required={true}
                  labelClassName="text-base font-semibold	 text-gray-700 required-field"
                  className="py-6 mt-3 text-md border-[1px] border-[#CECECE] rounded-[5px]  focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent "
                />
                {errors.practiceCity && (
                  <span className="text-red-500 text-sm">
                    {errors?.practiceCity?.message}
                  </span>
                )}
              </div>

              <div className="col-span-1">
                <Label className="text-base font-semibold	 text-gray-700 required-field">
                  State
                </Label>
                <Controller
                  name="practiceState"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "Practice State is required",
                    },
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={usStateList}
                      styles={customStyles}
                      classNames={{
                        control: () =>
                          "py-[5px] mt-3 text-md border-[1px] border-[#CECECE] rounded-[3px]  focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent  ",
                      }}
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption)
                      }
                      value={usStateList.find(
                        (option) => option.value === field.value
                      )}
                    />
                  )}
                />
                {errors.practiceState && (
                  <span className="text-red-500 text-sm">
                    {errors?.practiceState?.message}
                  </span>
                )}
              </div>

              <div className="col-span-1">
                <Label className="text-base font-semibold	 text-gray-700">
                  Country
                </Label>
                <Select
                  options={[]}
                  value={{ value: "USA", label: "United States" }}
                  styles={customStyles}
                  isDisabled
                  classNames={{
                    control: () =>
                      "py-[5px] mt-3 text-md border-[1px] border-[#CECECE] rounded-[3px]",
                  }}
                />
              </div>

              <div className="col-span-1">
                <FormInputField
                  register={register}
                  type="text"
                  placeholder="Enter your zip code..."
                  fieldName="practiceZipCode"
                  labelName="ZIP"
                  required={true}
                  maxLength={5}
                  labelClassName="text-base font-semibold	 text-gray-700 required-field"
                  className="py-6 mt-3 text-md border-[1px] border-[#CECECE] rounded-[5px]  focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent "
                />
                {errors.practiceZipCode && (
                  <span className="text-red-500 text-sm">
                    {errors?.practiceZipCode?.message}
                  </span>
                )}
              </div>
            </div>

            {/** description */}
            <div className="col-span-2 mt-14">
              <Label className="text-base font-semibold	 text-gray-700">
                Practice Description
              </Label>
              <Textarea
                value={practiceDescription}
                {...register("practiceDescription")}
                className="py-3 mt-3 text-md border-[1px] border-[#CECECE] rounded-[5px]  focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent"
                placeholder="Enter Practice Description..."
              />
            </div>
          </div>
          {/** button */}
          <SheetFooter className="mt-3 p-4">
            <Button
              className="bg-[#6995fe] min-h-[50px] min-w-[160px] border border-[#6995fe] font-normal text-base text-white px-[30px] py-[20px] rounded-[7px] hover:bg-[#6995fe]"
              type="submit"
              disabled={
                verifyError ||
                isSubmitDisabled ||
                !practiceName ||
                !practicePhone ||
                !EmailValidation(practiceEmail) ||
                !addressLine1 ||
                !practiceCity ||
                !practiceState ||
                !practiceCountry ||
                !practiceZipCode ||
                !servertimeZone
                  ? true
                  : false
              }
            >
              Submit
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AddPractice;
