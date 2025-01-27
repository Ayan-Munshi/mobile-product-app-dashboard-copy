import { useForm } from "react-hook-form";
import { Typography } from "@/components/custom/Typography";
import {
  useResetUserPasswordMutation,
  useUpdateUserSettingDataMutation,
} from "@/redux/practiceDashBoard/apiSlice";
import FormInputFieldAlt from "@/components/custom/FormInputFieldAlt";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Label } from "@/components/ui/label";
import Select from "react-select";
import { Icon } from "@iconify/react/dist/iconify.js";
import AccountSettingResetPassword from "./AccountSettingResetPassword";
import { toast, ToastContainer } from "react-toastify";
import { UserDetailsType } from "@/redux/practiceDashBoard/dashboardType";
import _ from "lodash";
import { twMerge } from "tailwind-merge";
import {
  AccountSettingsInputTypes,
  PasswordChangeTypes,
} from "@/types/accountSettings";
import { CSSObject } from "@emotion/react";

//*** Main return function
const AccountSettings = () => {
  const [emptyPsswordSection, setEmptyPsswordSection] = useState(false); //State to flush empty password field after reset api call
  const [comparisonBaseObject, setComparisonBaseObject] = useState<
    //Stores a snapshot of the original data from the database for comparing changes with new data ( based on this we compare old actual and updated data)
    Partial<AccountSettingsInputTypes> | undefined
  >({});

  //Inital data stored after fetching from api
  const [objectValueChange, setobjectValueChange] = useState<boolean>(false); // Comparing form data before and after user interaction
  const userData = useSelector(
    (state: RootState) => state?.persisted?.practice?.userDetails
  ); // storing extracted user data form redux

  // Initialize the update mutation
  const [updateUserSetting, { isLoading }] = useUpdateUserSettingDataMutation();
  const [resetUserPassword] = useResetUserPasswordMutation();

  // Initialize the form with react-hook-form
  const { register, setValue, handleSubmit, watch } =
    useForm<AccountSettingsInputTypes>({
      defaultValues: {
        name: "",
        phone: "",
        email: "",
        streetAddress: "",
        city: "",
        country: "United States",
        state: "",
        zipCode: "",
      },
    });

  //Destructured the  watched value
  const { name, phone, city, email, streetAddress, country, state, zipCode } =
    watch();
  const watchedValue = watch();

  // React-select styles
  const customStyles = {
    control: (base: CSSObject, state: any) => ({
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
    dropdownIndicator: (base: CSSObject) => ({
      ...base,
      display: "none", // Hide the dropdown indicator (arrow)
    }),
    indicatorSeparator: (base: CSSObject) => ({
      ...base,
      display: "none", // Remove the separator line
    }),
    indicatorContainer: (base: CSSObject) => ({
      ...base,
      display: "none", // Remove the entire indicator container
    }),
  };

  // if userData exists then handleSetFormDataValue will set the react hook form data and it's return value updates the setComparisonBaseObject
  useEffect(() => {
    if (userData) {
      const updatedObject = handleSetFormDataValue(userData);
      setComparisonBaseObject(updatedObject);
    }
  }, [userData]);

  // effect for monitoring interacted data with the fetched one
  useEffect(() => {
    const isEqual = _.isEqual(comparisonBaseObject, watchedValue); // Deep comparison
    setobjectValueChange(isEqual); // Update state based on the comparison
  }, [watchedValue, comparisonBaseObject]);

  // Form submit handler is updating account setting data and triggering the toast based on the response
  const onSubmit = async (data: AccountSettingsInputTypes) => {
    try {
      const response = await updateUserSetting(data).unwrap();
      if (response?.success) {
        toast.success(response?.message);
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  // Form submit handler its resetting the password  and showing the toast based on the response
  const handleResetPassword = async (data: PasswordChangeTypes) => {
    try {
      const response = await resetUserPassword(data).unwrap();
      if (response?.success) {
        toast.success(response?.message);
        setEmptyPsswordSection(true);
      }
    } catch (error: any) {
      toast.error(error?.message);
      setEmptyPsswordSection(true);
    }
  };

  // If userData exists (in api response), this function maps the data with corresponding keys and then stores them in comparisonBaseObject and then sets the same data as initial value of hook form by using setValue
  function handleSetFormDataValue(userData: UserDetailsType | null) {
    if (!userData) return;
    const updatedState: Partial<AccountSettingsInputTypes> = {
      name: userData?.billing_name || "",
      phone: userData?.phone || "",
      email: userData?.email || "",
      streetAddress: userData?.street_address || "",
      city: userData?.city || "",
      state: userData?.state || "",
      country: userData?.country || "",
      zipCode: userData?.zipcode || "",
    };
    //updating hook form data
    (
      Object.entries(updatedState) as [
        keyof AccountSettingsInputTypes,
        string | undefined
      ][]
    ).forEach(([key, value]) => {
      if (value !== undefined) {
        setValue(key, value);
      }
    });

    return updatedState;
  }

  // *** main return
  return (
    <div id="settings" className="bg-white m-5 flex flex-col ">
      <div className=" p-[30px]">
        <Typography as="h1" className="text-black font-medium text-[24px]">
          Account Settings
        </Typography>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-start "
      >
        <div className=" px-[15px] md:px-[30px] w-[98%] max-w-[720px] gap-6 flex flex-wrap">
          {/* input field for name */}
          <FormInputFieldAlt
            type="text"
            register={register}
            fieldName="name"
            placeholder="Enter Name..."
            labelName="Name"
            labelSecondary="Primary account holder's name"
            labelClassName="text-base 2xl:text-[18px] text-[#616161] font-medium"
            inputClassName="h-[55px] border-2 rounded-[6px] w-full md:w-[60%] focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-transparent mt-[10px] md:mt-[0px]"
            containerClassName="container-test flex w-full flex-wrap items-center mt-2"
            labelContainerClassName=" w-full md:w-[40%]"
          />

          {/* input field for email */}
          <FormInputFieldAlt
            type="text"
            register={register}
            fieldName="email"
            placeholder="Enter Email..."
            labelName="Email"
            labelSecondary="Primary email connected to this account"
            labelClassName="text-base 2xl:text-[18px] text-[#616161] font-medium"
            inputClassName="h-[55px] border-2 rounded-[6px] w-full md:w-[60%] focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-transparent mt-[10px] md:mt-[0px]"
            containerClassName="container-test flex w-full flex-wrap items-center mt-2"
            labelContainerClassName=" w-full md:w-[40%]"
          />
          {/* input field for phone */}
          <FormInputFieldAlt
            type="text"
            register={register}
            fieldName="phone"
            placeholder="Primary contact number..."
            labelName="Phone"
            labelSecondary="Your primary contact number"
            labelClassName="text-base 2xl:text-[18px] text-[#616161] font-medium"
            inputClassName="h-[55px] border-2 rounded-[6px] w-full md:w-[60%] focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-transparent mt-[10px] md:mt-[0px]"
            containerClassName="container-test flex w-full flex-wrap items-center mt-2"
            labelContainerClassName=" w-full md:w-[40%]"
          />
        </div>

        <div className=" max-w-[720px] w-full px-[15px] md:px-[30px]  ">
          {/* heading */}
          <div>
            <Typography
              as="h2"
              className="mt-7 text-lg font-medium text-[#636363]"
            >
              Billing Address
            </Typography>
            <Typography
              as="p"
              className="text-base font-medium text-[#818181] mt-1.5 "
            >
              Your account name
            </Typography>
          </div>
          {/* inputs */}
          <div className="grid grid-cols-7 ">
            <FormInputFieldAlt
              type="text"
              register={register}
              fieldName="streetAddress"
              placeholder="Enter Street Address..."
              labelName="Street Address"
              labelClassName="text-base 2xl:text-[18px] text-[#616161] font-medium"
              containerClassName="col-start-1 col-end-8  mt-7"
              labelContainerClassName=""
              inputClassName="h-[55px] border-2 mt-2 rounded-[6px] focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-transparent"
            />
            <FormInputFieldAlt
              type="text"
              register={register}
              fieldName="city"
              placeholder="Enter your city..."
              labelName="City"
              labelClassName="text-base 2xl:text-[18px] text-[#616161] font-medium"
              containerClassName="md:col-start-1 md:col-end-4 col-span-full mt-5"
              labelContainerClassName=" mt-2"
              inputClassName="h-[55px] border-2 mt-2 rounded-[6px] focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-transparent"
            />

            <FormInputFieldAlt
              type="text"
              register={register}
              fieldName="state"
              placeholder="Enter your state..."
              labelName="State"
              labelClassName="text-base 2xl:text-[18px] text-[#616161] font-medium"
              containerClassName="md:col-start-5 md:col-end-8 col-span-full mt-5 "
              labelContainerClassName=" mt-2"
              inputClassName="h-[55px] border-2 mt-2 rounded-[6px] focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-transparent"
            />

            <div className="md:col-start-1 md:col-end-4 col-span-full mt-8">
              <Label className="text-base 2xl:text-[18px] text-[#616161] font-medium">
                Country
              </Label>
              <Select
                options={[]}
                value={{ value: "USA", label: "United States" }}
                styles={customStyles}
                isDisabled
                classNames={{
                  control: () =>
                    "h-[55px] border-2 mt-2 rounded-[6px] focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-transparent",
                }}
              />
            </div>

            <FormInputFieldAlt
              type="text"
              register={register}
              fieldName="zipCode"
              placeholder="Enter your zipcode..."
              labelName="Zip"
              labelClassName="text-base 2xl:text-[18px] text-[#616161] font-medium"
              containerClassName="md:col-start-5 md:col-end-8 col-span-full mt-3 "
              labelContainerClassName=" mt-5"
              inputClassName="h-[55px] border-2 mt-2 rounded-[6px] focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-transparent"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className=" flex justify-end px-[15px] md:px-[30px] w-[98%] max-w-[750px] my-7">
          <button
            type="submit"
            className={twMerge(
              isLoading ||
                objectValueChange ||
                !name ||
                !phone ||
                !city ||
                !email ||
                !streetAddress ||
                !country ||
                !state ||
                !zipCode
                ? "h-[49px] bg-[#769FFD] text-white rounded-[7px] px-5 py-2 hover:bg-[#769FFD] opacity-[0.5]"
                : "h-[49px] bg-[#769FFD] text-white rounded-[7px] px-5 py-2 hover:bg-[#769FFD]"
            )}
            disabled={
              isLoading ||
              objectValueChange ||
              !name ||
              !phone ||
              !city ||
              !email ||
              !streetAddress ||
              !country ||
              !state ||
              !zipCode
            }
          >
            {isLoading ? (
              "Saving..."
            ) : (
              <div className="flex items-center gap-1">
                <Icon
                  icon="mingcute:save-line"
                  style={{ color: "white" }}
                  className="size-4"
                />
                Save
              </div>
            )}
          </button>
        </div>
      </form>
      <hr className="border-t-2 border-dotted border-gray-300 w-full my-[40px]"></hr>

      {/* Account Setting Reset Password component */}
      <AccountSettingResetPassword
        handleResetPassword={handleResetPassword}
        emptyPsswordSection={emptyPsswordSection}
      />
      {/* Feedback Messages */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default AccountSettings;
