import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Seperater from "../../components/custom/Seperater";
import FormInputField from "../../components/custom/FormInputField";
import { useNavigate } from "react-router-dom";
import { useUserLoginMutation } from "@/redux/practiceDashBoard/apiSlice";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/custom/Typography";
import { useDispatch } from "react-redux";
import { persistAuth, persistToken } from "@/redux/practiceDashBoard/slice";
import Loader from "@/components/custom/Loader";
// Define form input types
type LoginFormInputs = {
  email: string;
  password: string;
  // rememberme: boolean;
};

function LoginForm() {
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "",
      password: "",
      // rememberme: false,
    },
  });

  const { email, password } = watch();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const passwordRef = useRef<HTMLInputElement>(null);
  // const autoFilledValue = passwordRef.current?.value;
  const [userLogin, { error, isLoading }] = useUserLoginMutation();

  const handleLogin: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const result = await userLogin(data)?.unwrap();
      dispatch(persistToken(result?.token ? result?.token : ""));

      if (result?.success) {
        dispatch(persistAuth(true));
        navigate("/dashboard");
      } else if (!result?.success) {
        toast.error(error?.message);
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="min-h-full flex items-center">
          <Loader />
        </div>
      ) : (
        <div
          id="loginForm"
          className=" flex flex-col justify-center  max-w-[520px] md:w-[450px] w-[90%] "
        >
          {/* <div className="md:hidden px-3 self-center">
        <img src={godental_logo} alt="" />
      </div> */}
          <div className="space-y-2 p-5 mt-5">
            <div className="">
              <Typography
                as="h1"
                className="font-semibold	 text-gray-600 text-[30px] ml-0.5"
              >
                Log In
              </Typography>
              <div className=" text-gray-500 mt-2 ml-0.5">
                Welcome Back! Please enter your details.
              </div>
            </div>
            <form
              onSubmit={handleSubmit(handleLogin)}
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
              {errors?.email && (
                <span className="text-red-500">{errors?.email.message}</span>
              )}

              <div className="mt-1">
                <label className="font-medium text-md text-gray-500">
                  Password
                </label>
                <div className="relative mt-[11px]">
                  <input
                    {...register("password", {
                      required: "Password is required",
                    })}
                    type={showPassword ? "text" : "password"}
                    // ref={passwordRef}
                    className="h-[62px] px-4 border-2 border-gray-300 placeholder-gray-500 placeholder:text-[15px] text-md w-full rounded-[7px] outline-1 outline-blue-200"
                    placeholder="Enter your password..."
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword(!showPassword);
                    }}
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
                        className="text-gray-300  lg:size-[25px] size-[22px]"
                      />
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="text-red-600">{errors.password.message}</p>
              )}

              {/** remember me  */}
              <div className="flex items-center space-x-2 mt-4 justify-start">
                {/* <div className="flex items-center justify-start space-x-2 mt-2 ">
              <Input
                type="checkbox"
                id="rememberme"
                {...register("rememberme")}
                className="size-[15px] "
              />
              <label className="text-md text-gray-500 font-normal">
                Remember me
              </label>
            </div> */}
                {/* <a href="" className="text-blue-400">
              Forgot password?
            </a> */}
                <p
                  className="text-blue-400 cursor-pointer"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </p>
              </div>

              <div className=" mt-2.5  text-white">
                <Button
                  disabled={!email || !password}
                  type="submit"
                  className="bg-button-clr-400 hover:bg-[#7FA9E6] rounded-md p-2.5 text-[16px] font-medium w-full h-12 "
                >
                  Log In
                </Button>
              </div>
            </form>
            <Seperater width="70%" />
            <div className="flex items-center justify-center m-auto gap-2 mt-4">
              <Typography as="h1" className="font-sans text-gray-500 ">
                Don't have an account?
              </Typography>
              <a
                target="_blank"
                href="https://allinone.dental/get-a-demo"
                className="border-blue-400 p-0.5 font-sans text-blue-400 font-semibold"
              >
                Get a Demo.
              </a>
            </div>
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
      )}
    </>
  );
}

export default LoginForm;
