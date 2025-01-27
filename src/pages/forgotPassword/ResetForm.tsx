import { useForm, SubmitHandler } from "react-hook-form";
import FormInputField from "../../components/custom/FormInputField";
import { useForgotPasswordMutation } from "@/redux/practiceDashBoard/apiSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/custom/Typography";
import { useState } from "react";
import { ForgotPasswordFormInputsType } from "@/types/forgotPassword";
import { NavLink } from "react-router-dom";

function ResetForm() {
  const [showResetLinkMessage, setShowResetLinkMessage] = useState(false);
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputsType>({
    defaultValues: {
      email: "",
    },
  });

  const { email } = watch();
  const [forgotPassword, { error }] = useForgotPasswordMutation();

  const handleForgetPassowrd: SubmitHandler<
    ForgotPasswordFormInputsType
  > = async (data) => {
    try {
      const result = await forgotPassword(data)?.unwrap();
      if (result?.success) {
        setShowResetLinkMessage(true);
        toast.success(result?.message);
      } else if (!result?.success) {
        toast.error(error?.message);
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  return (
    <div
      id="loginForm"
      className=" flex flex-col justify-center  max-w-[520px] md:w-[450px] w-[90%] "
    >
      {/* <div className="md:hidden px-3 self-center">
        <img src={godental_logo} alt="" />
      </div> */}
      <div className="p-5 mt-5">
        <div className="">
          <Typography
            as="h1"
            className="font-semibold	 text-gray-600 text-[30px] ml-0.5"
          >
            Forgot Password
          </Typography>
          <div className=" text-gray-500 mt-2 ml-0.5">
            Follow the steps below to reset password
          </div>
        </div>
        {!showResetLinkMessage ? (
          <form
            onSubmit={handleSubmit(handleForgetPassowrd)}
            className="flex flex-col gap-4 rounded-md justify-center"
          >
            <FormInputField
              required={true}
              register={register}
              type={"email"}
              placeholder={"Enter your email..."}
              fieldName={"email"}
              labelName={"Email"}
              labelClassName={"text-md text-gray-500 mt-3"}
              className="h-[62px] px-4 border-2 border-gray-300 placeholder-gray-400 placeholder:text-[15px] text-md w-full rounded-[7px] mt-[2px] focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent "
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}

            <div className=" mt-2.5  text-white">
              <Button
                disabled={!email}
                type="submit"
                className="bg-button-clr-400 rounded-md p-2.5 text-[16px] font-medium w-full hover:bg-opacity-90 h-12 "
              >
                Send Reset Link
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-10">
            <Typography as="p">
              Password reset link has been sent to your email. Follow the link
              to reset the password.
            </Typography>
            <div className="mt-4">
              <NavLink
                to={"/login"}
                className="cursor-pointer mt-10 text-gray-500"
              >
                Back to{" "}
                <span className="text-blue-400 border-b border-blue-300">
                  login
                </span>
              </NavLink>
            </div>
          </div>
        )}
      </div>
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
}

export default ResetForm;
