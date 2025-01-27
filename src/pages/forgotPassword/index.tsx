import Promotion from "./Promotion";
import ResetForm from "./ResetForm";

function ForgotPassword() {
  return (
    <div id="login" className="flex min-h-screen w-full ">
      <div className="  flex justify-center lg:w-1/2 w-full  ">
        <ResetForm />
      </div>

      <div className="  lg:w-1/2  md:flex items-center justify-center hidden bg-brand-bg-color p-4">
        <Promotion />
      </div>
    </div>
  );
}

export default ForgotPassword;
