import FormInputFieldAlt from "@/components/custom/FormInputFieldAlt";
import { Typography } from "@/components/custom/Typography";
import { PasswordChangeTypes } from "@/types/accountSettings";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";

// type props of this component
type AppProps = {
  handleResetPassword: (data: PasswordChangeTypes) => void;
  emptyPsswordSection: boolean;
};

//*** Main return function

const AccountSettingResetPassword = ({
  handleResetPassword,
  emptyPsswordSection,
}: AppProps) => {
  // Initialize the form with react-hook-form
  const { register, watch, handleSubmit, setValue } =
    useForm<PasswordChangeTypes>({
      defaultValues: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    });

  const [showPassword, setShowPassword] = useState(false);
  //Manages the state for password input focus and the visibility of the validation rules panel.
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showValidationPanel, setShowValidationPanel] = useState(true);
  const { confirmPassword, newPassword, currentPassword } = watch();

  // Validates if the new password meets the required criteria: minimum length, inclusion of a number, and a special character.
  const passwordMinLength = newPassword.length >= 8;
  const passwordHasNumber = /[0-9]/.test(newPassword);
  const passwordHasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  // Hides the password validation panel after 0.5 seconds if all rules are satisfied, otherwise keeps it visible.

  useEffect(() => {
    if (passwordMinLength && passwordHasNumber && passwordHasSpecialChar) {
      setTimeout(() => {
        setShowValidationPanel(false);
      }, 500);
    } else {
      setShowValidationPanel(true);
    }
  }, [
    newPassword,
    passwordMinLength,
    passwordHasNumber,
    passwordHasSpecialChar,
  ]);

  // Listens for changes in emptyPasswordSection and triggers handleResetState when it becomes true.

  useEffect(() => {
    if (emptyPsswordSection) {
      handleResetState();
    }
  }, [emptyPsswordSection]);

  // Handles the focus and blur state of the new password input field.
  const handlePasswordFocus = () => setIsPasswordFocused(true);
  const handlePasswordBlur = () => setIsPasswordFocused(false);

  // Resets the password fields (currentPassword, newPassword, and confirmPassword) to their default empty state.
  const handleResetState = () => {
    setValue("confirmPassword", "");
    setValue("newPassword", "");
    setValue("currentPassword", "");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // *** main return
  return (
    <form onSubmit={handleSubmit(handleResetPassword)}>
      <div className="max-w-[720px] w-full px-[15px] md:px-[30px]">
        {/* heading */}
        <div className="">
          <Typography as="h2" className="text-lg font-base text-[#636363]">
            Change Password
          </Typography>
          <Typography
            as="p"
            className="text-base font-medium text-[#818181] mt-1.5 "
          >
            Change your account password
          </Typography>
        </div>
        <div className="  gap-6 flex flex-wrap mt-8">
          {/* input field for name */}
          <FormInputFieldAlt
            type="text"
            register={register}
            fieldName="currentPassword"
            placeholder="Enter current password..."
            labelName="Current Password"
            labelSecondary="Enter your current password"
            labelClassName="text-base 2xl:text-[18px] text-[#616161] font-medium"
            inputClassName="h-[55px] border-2 rounded-[6px] w-full md:w-[60%] focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-transparent mt-[10px] md:mt-[0px]"
            containerClassName="container-test flex w-full flex-wrap items-center mt-2"
            labelContainerClassName=" w-full md:w-[40%]"
          />

          {/* input field for email */}

          <div className="relative w-full">
            <FormInputFieldAlt
              type={showPassword ? "text" : "password"}
              register={register}
              fieldName="newPassword"
              placeholder="Enter new Password..."
              labelName="New Password"
              labelSecondary="Email used for you account"
              labelClassName="text-base 2xl:text-[18px] text-[#616161] font-medium"
              inputClassName="h-[55px] border-2 rounded-[6px] w-full md:w-[60%] focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-transparent mt-[10px] md:mt-[0px]"
              containerClassName="relative container-test flex w-full flex-wrap items-center mt-2"
              labelContainerClassName=" w-full md:w-[40%]"
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-[23px] right-2 bg-none"
            >
              {showPassword ? (
                <Icon
                  icon="ic:outline-remove-red-eye"
                  className="text-gray-400 lg:size-[25px] size-[22px]"
                />
              ) : (
                <Icon
                  icon="ant-design:eye-invisible-outlined"
                  className="text-gray-300  lg:size-[25px] size-[22px]"
                />
              )}
            </button>

            {/* rules panel */}
            {isPasswordFocused && showValidationPanel ? (
              <div className="mt-2 text-sm absolute left-[200px] bg-white shadow-md rounded border p-4 w-[250px] ">
                <p
                  className={
                    passwordMinLength ? "text-green-500" : "text-red-500"
                  }
                >
                  {passwordMinLength ? "✔" : "✖"} Minimum 10 characters
                </p>
                <p
                  className={
                    passwordHasNumber ? "text-green-500" : "text-red-500"
                  }
                >
                  {passwordHasNumber ? "✔" : "✖"} Contains a number
                </p>
                <p
                  className={
                    passwordHasSpecialChar ? "text-green-500" : "text-red-500"
                  }
                >
                  {passwordHasSpecialChar ? "✔" : "✖"} Contains a special
                  character
                </p>
              </div>
            ) : (
              ""
            )}
          </div>

          {/* input field for phone */}
          <FormInputFieldAlt
            type="password"
            register={register}
            fieldName="confirmPassword"
            placeholder="Re-enter new password..."
            labelName="Confirm New Passwoed"
            labelSecondary="Confirm New Passwoed"
            labelClassName="text-base 2xl:text-[18px] text-[#616161] font-medium"
            inputClassName="h-[55px] border-2 rounded-[6px] w-full md:w-[60%] focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-transparent mt-[10px] md:mt-[0px]"
            containerClassName="container-test flex w-full flex-wrap items-center mt-2"
            labelContainerClassName=" w-full md:w-[40%]"
            onPaste={(e: React.ClipboardEvent<HTMLInputElement>) =>
              e.preventDefault()
            }
          />
        </div>
      </div>
      <div className=" flex justify-end px-[15px] md:px-[30px] w-[98%] max-w-[750px] my-7">
        <button
          type="submit"
          className={twMerge(
            !confirmPassword ||
              !newPassword ||
              !currentPassword ||
              newPassword !== confirmPassword
              ? "h-[49px] bg-[#769FFD] opacity-[0.5] text-white rounded-[7px] px-5 py-2"
              : " h-[49px] bg-[#769FFD] text-white rounded-full px-5 py-2 hover:bg-blue-600"
          )}
          disabled={
            !confirmPassword ||
            !newPassword ||
            !currentPassword ||
            newPassword !== confirmPassword
          }
        >
          <div className="flex items-center gap-1">
            <Icon
              icon="mingcute:save-line"
              style={{ color: "white" }}
              className="size-4"
            />
            Save
          </div>
        </button>
      </div>
    </form>
  );
};

export default AccountSettingResetPassword;
