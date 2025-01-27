import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate, useParams } from "react-router-dom";
import {
  useResetPasswordMutation,
  useVfyResetLinkQuery,
} from "@/redux/practiceDashBoard/apiSlice";
import PageNotFound from "@/components/PageNotFound";
import { toast, ToastContainer } from "react-toastify";
import { Typography } from "@/components/custom/Typography";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showValidationPanel, setShowValidationPanel] = useState(true);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const passwordMinLength = newPassword.length >= 8;
  const passwordHasNumber = /[0-9]/.test(newPassword);
  const passwordHasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const [timer,setTimer]=useState<number|null>(null);
  const resetLinkId = useParams();
  const navigate=useNavigate();

  const { data: verifyLinkDetails = {} } = useVfyResetLinkQuery(
    {
      id: resetLinkId?.id ? resetLinkId?.id : "",
    },
    { skip: !resetLinkId?.id }
  );
  const [resetPassword] = useResetPasswordMutation();

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

  //Redirect timer
  useEffect(()=>{
    if(timer===0)return navigate("/login")
    if(timer===null)return;
    let interverl=setInterval(()=>{
      setTimer((prev:any) => (prev ? prev - 1 : 0));
    },1000)
    return ()=>clearInterval(interverl)
  },[timer])

  //  password-related handlers
  const handlePasswordFocus = () => setIsPasswordFocused(true);
  const handlePasswordBlur = () => setIsPasswordFocused(false);

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await resetPassword({
        link: resetLinkId?.id ? resetLinkId?.id : "",
        confirmPassword,
      })?.unwrap();
      if (response?.success) {
        toast.success(response?.message);
        setTimer(5)
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  return (
    <>
      {verifyLinkDetails?.success ? (
        <div>
          <div className="flex flex-col items-center  px-6 py-8 ">
            <div className="w-full p-6 bg-white rounded-lg max-w-[480px] sm:p-8">
              <div className="w-full flex justify-center items-center">
                <img
                  src="https://d22gspqa8b57yo.cloudfront.net/uploads/logo.png"
                  alt="Logo"
                />
              </div>
              <form className="mt-4 space-y-4" onSubmit={submitHandler}>
                <div className="relative">
                  <label className="text-md text-gray-500 font-medium mt-3">
                    New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password..."
                    className="bg-gray-50 mt-2 border-2 h-[62px]  border-gray-300 text-gray-900 text-sm rounded-md block w-full p-2.5 outline-blue-200"
                    required
                    onFocus={handlePasswordFocus}
                    onBlur={handlePasswordBlur}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute top-[52px] right-2 bg-none"
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
                          passwordHasSpecialChar
                            ? "text-green-500"
                            : "text-red-500"
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
                <div>
                  <label className="text-md text-gray-500 font-medium mt-3">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password..."
                    className="bg-gray-50 mt-2 border-2 h-[62px]  border-gray-300 text-gray-900 text-sm rounded-md block w-full p-2.5 outline-blue-200"
                    required
                    onPaste={(e) => e.preventDefault()}
                  />
                </div>

                <div className="w-full flex">
                  <Button
                    type="submit"
                    disabled={
                      passwordMinLength &&
                      passwordHasNumber &&
                      passwordHasSpecialChar &&
                      newPassword &&
                      confirmPassword &&
                      newPassword === confirmPassword
                        ? false
                        : true
                    }
                    className=" mt-2 text-white bg-primary-600 h-[50px] w-full hover:bg-primary-700 font-medium rounded-md text-sm px-5 py-2.5 text-center bg-button-clr-400 hover:bg-[#7FA9E6]"
                  >
                    Reset Password
                  </Button>
                </div>
                {timer?<div><Typography as="p">Redirecting to login in {timer}</Typography></div>:""}
              </form>
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
      ) : (
        <PageNotFound message="The link seems to have expired!" />
      )}
    </>
  );
};

export default ResetPassword;
