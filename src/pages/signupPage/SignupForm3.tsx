import { useEffect, useState } from "react";
import {
  SubmitHandler,
  FieldErrors,
} from "react-hook-form";
import FormInputField from "../../components/custom/FormInputField";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/custom/Typography";

// Define form input types
type SignFormInputs = {
  accesscode: string;
  termsandcondition: [];
  password: string;
  termsAccepted: boolean;
};

// Define prop types for SignupForm3
type SignupForm3Props = {
  onBack: () => void;
  handleSubmit: any;
  watch: any;
  register:any;
  errors: FieldErrors<SignFormInputs>;
  onSignUp: SubmitHandler<SignFormInputs>;
};

function SignupForm3({
  onBack,
  handleSubmit,
  watch,
  register,
  errors,
  onSignUp,
}: SignupForm3Props) {
  const handler: SubmitHandler<SignFormInputs> = (data) => {
    onSignUp(data); // this function is in index
  };

  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showValidationPanel, setShowValidationPanel] = useState(true);

  const { password, accesscode, termsAccepted } = watch();

  const passwordMinLength = password.length >= 8;
  const passwordHasNumber = /[0-9]/.test(password); // test is from js
  const passwordHasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // if the 3 conditions met the timeout will be started , 0.5 secs the panel will be disappear else the panel will be visible
  useEffect(() => {
    if (passwordMinLength && passwordHasNumber && passwordHasSpecialChar) {
      setTimeout(() => {
        setShowValidationPanel(false);
      }, 500);
    } else {
      setShowValidationPanel(true);
    }
  }, [password, passwordMinLength, passwordHasNumber, passwordHasSpecialChar]);

  //  password-related handlers
  const handlePasswordToggle = () => setShowPassword(!showPassword);
  const handlePasswordFocus = () => setIsPasswordFocused(true);
  const handlePasswordBlur = () => setIsPasswordFocused(false);

  return (
    <div
      id="SignupForm"
      className="flex flex-col justify-center h-full max-w-[520px] md:w-[450px] w-[90%]  "
    >
      <div className=" p-5 ">
        <div className="">
          <Typography
            as="h1"
            className="font-semibold	 text-gray-600 text-[30px] ml-0.5"
          >
            Sign Up
          </Typography>

          <div className="text-gray-500 mt-2 ml-0.5">
            Welcome Back! Please enter your details.
          </div>
        </div>

        <div className="flex justify-start items-center gap-2  mt-4">
          <button onClick={onBack} className="">
            <Icon
              icon="ion:arrow-back-circle-outline"
              className="text-gray-400 size-8"
            />
          </button>
          <p className="font-semibold text-sm text-blue-400 hidden">Step 2</p>
        </div>
        <form
          onSubmit={handleSubmit(handler)}
          className="flex flex-col gap-4 rounded-md justify-center mt-3.5 "
        >
          {/** password */}

          <div className="mt-1">
            <label className="text-md text-gray-500 font-medium">
              Password
            </label>
            <div className="relative mt-[11px]">
              <input
                onFocus={handlePasswordFocus}
                {...register("password", {
                  required: "Password is required",
                  onBlur: handlePasswordBlur,
                })}
                type={showPassword ? "text" : "password"}
                className=" h-[62px] px-4  border-2 border-gray-300 placeholder-gray-500 placeholder:text-sm text-md w-full rounded-[7px] outline-1 outline-blue-200"
                placeholder="Create new password..."
              />

              <button
                type="button"
                onClick={handlePasswordToggle}
                className="absolute inset-y-0 right-0 flex items-center px-3"
              >
                {showPassword ? (
                  <Icon
                    icon="ic:outline-remove-red-eye"
                    className="text-gray-400 lg:size-[25px] size-[22px]"
                  />
                ) : (
                  <Icon
                    icon="ant-design:eye-invisible-outlined"
                    className="text-gray-300 lg:size-[25px] size-[22px]"
                  />
                )}
              </button>
            </div>

            {isPasswordFocused && showValidationPanel ? (
              <div className="mt-2 text-sm absolute bg-white shadow-md rounded border p-4 ">
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

            {errors.password && (
              <p className="text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="">
            <FormInputField
              register={register}
              type={"text"}
              placeholder={"Enter the Code..."}
              fieldName={"accesscode"}
              labelName={"Code"}
              labelClassName={"text-md text-gray-500 "}
              className="h-[62px] border-2 border-gray-300 placeholder-gray-400 placeholder:text-sm text-md w-full rounded-[7px] mt-2 focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent"
            />
            {errors.accesscode && (
              <span className="text-red-500">{errors.accesscode.message}</span>
            )}
          </div>

          {/** terms and conditions */}
          <div className="flex items-center justify-start space-x-2 mt-2 ">
            <Input
              type="checkbox"
              id="termsAccepted"
              {...register("termsAccepted")}
              className="size-[15px] "
            />
            <label className="text-md text-gray-500 font-normal">
              Terms & Conditions
            </label>
          </div>

          <div className="mt-2.5 flex gap-3 text-white">
            <Button
              disabled={
                passwordMinLength &&
                passwordHasNumber &&
                passwordHasSpecialChar &&
                accesscode &&
                termsAccepted
                  ? false
                  : true
              }
              type="submit"
              className="rounded-md p-2.5 text-base font-medium bg-button-clr-400 hover:bg-[#7FA9E6] h-12 w-full "
            >
              Sign up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupForm3;
