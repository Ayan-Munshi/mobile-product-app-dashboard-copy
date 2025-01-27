import {
  SubmitHandler,
  Controller,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import FormInputField from "../../components/custom/FormInputField";
import { Label } from "@/components/ui/label";
import Select from "react-select";
import { usStateList } from "@/constant/usStateList";
import { Icon } from "@iconify/react/dist/iconify.js";
import FormNumberTypeInputField from "@/components/custom/FormNumberTypeInputField";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/custom/Typography";

// Define form input types
type SignFormInputs = {
  streetaddress: string;
  practiceCity: string;
  practiceState: string;
  practiceCountry: string;
  practiceZipCode: string;
};

type SignupForm2Props = {
  onBack: () => void;
  onNext: () => void;
  handleSubmit: UseFormHandleSubmit<SignFormInputs>;
  register: any;
  // register: UseFormRegister<SignFormInputs>;
  watch: () => SignFormInputs;
  errors: FieldErrors<SignFormInputs>;
  control: any;
};

function SignupForm2({
  onBack,
  onNext,
  handleSubmit,
  register,
  watch,
  errors,
  control,
}: SignupForm2Props) {
  const {
    streetaddress,
    practiceCity,
    practiceState,
    practiceCountry,
    practiceZipCode,
  } = watch();

  const handler: SubmitHandler<SignFormInputs> = () => {
    onNext();
  };

  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      width: "100%", // Ensures full width
      borderRadius: "7px",
      borderWidth: "2px",
      borderColor: "#d1d5db",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#d1d5db", // Keep border color on hover
      },
      ...(state.isFocused && {
        borderColor: "#BFDBFE !important", // Focused state border color
      }),
    }),
  };

  return (
    <div
      id="SignupForm"
      className="flex flex-col justify-center max-w-[520px] md:w-[450px] w-[90%]"
    >
      <div className="space-y-2 p-5">
        <div>
          <Typography
            as="h1"
            className="font-semibold	 text-gray-600 text-[30px] ml-0.5"
          >
            Sign Up
          </Typography>

          <div className="text-gray-500 mt-2 ml-0.5">
            Welcome Back! Please enter your details.
          </div>
          <div className="flex justify-start items-center gap-2 my-4">
            <button onClick={onBack} className="">
              <Icon
                icon="ion:arrow-back-circle-outline"
                className="text-gray-400 size-8"
              />
            </button>
            <p className="font-semibold text-sm text-blue-400 hidden">Step 2</p>
          </div>
        </div>

        <Typography as="h2" className="text-md font-medium text-gray-500 mt-1">
          {" "}
          Address
        </Typography>

        <form onSubmit={handleSubmit(handler)} className=" ">
          <div className=" space-y-3">
            <div className="mt-2">
              <FormInputField
                register={register}
                type="text"
                placeholder="Apartment, suite, etc(Optional)"
                fieldName="streetaddress"
                labelName=" Street Address "
                required={true}
                labelClassName=" text-md text-gray-500"
                className="h-[60px] border-2 border-gray-300 placeholder-gray-400 placeholder:text-sm w-full text-md rounded-[7px] mt-[10px] focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent"
              />
              {errors.streetaddress && (
                <span className="text-red-500 text-sm">
                  {errors?.streetaddress?.message}
                </span>
              )}
            </div>
            <div className="flex">
              <div className="flex gap-3 w-full">
                <div className=" w-1/2">
                  <FormInputField
                    register={register}
                    type="text"
                    placeholder="Enter your city..."
                    fieldName="practiceCity"
                    labelName="City"
                    required={true}
                    labelClassName="text-md text-gray-500"
                    className="h-[56px] border-2 border-gray-300 placeholder-gray-400 placeholder:text-sm text-md w-full rounded-[7px] mt-[4px] focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent"
                  />
                  {errors.practiceCity && (
                    <span className="text-red-500 text-sm ">
                      {errors?.practiceCity?.message}
                    </span>
                  )}
                </div>

                <div className="w-1/2">
                  <Label className="text-md text-gray-500">State</Label>
                  <Controller
                    name="practiceState"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={usStateList}
                        styles={customStyles}
                        classNames={{
                          control: () =>
                            "py-[7px] text-md border-[2px] rounded-[3px] mt-1 w-full",
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
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-1/2">
                <Label className="text-md text-gray-500">Country</Label>
                <Select
                  options={[]}
                  value={{ value: "USA", label: "USA" }}
                  styles={customStyles}
                  isDisabled
                  classNames={{
                    control: () =>
                      "py-[9px] mt-1 text-md border-[1px]  rounded-[3px]",
                  }}
                />
              </div>

              <div className="w-1/2">
                <FormNumberTypeInputField
                  maxLength={5}
                  register={register}
                  type="text"
                  placeholder="Enter your zip code..."
                  fieldName="practiceZipCode"
                  labelName="ZIP Code"
                  required={true}
                  labelClassName="text-md text-gray-500"
                  className="h-[59px] border-2 border-gray-300 placeholder-gray-400 placeholder:text-sm text-md w-full rounded-[7px] mt-[4px] focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent"
                />
                {errors.practiceZipCode && (
                  <span className="text-red-500 text-sm">
                    {errors?.practiceZipCode?.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-7 flex gap-3 text-white">
            <Button
              disabled={
                streetaddress &&
                practiceCity &&
                practiceState &&
                practiceCountry &&
                practiceZipCode
                  ? false
                  : true
              }
              type="submit"
              className="rounded-md p-2.5 text-base font-medium bg-button-clr-400 hover:bg-[#7FA9E6] h-12 w-full "
            >
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupForm2;
