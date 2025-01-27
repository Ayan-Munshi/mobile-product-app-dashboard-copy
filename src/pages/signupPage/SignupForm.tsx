import { SubmitHandler } from "react-hook-form";
import Seperater from "../../components/custom/Seperater";
import CreateNewAccountCTA from "../../components/custom/CreateNewAccountCTA";
import FormInputField from "../../components/custom/FormInputField";
import FormNumberTypeInputField from "@/components/custom/FormNumberTypeInputField";
import EmailValidation from "@/utils/EmailValidation";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/custom/Typography";

// Define form input types
type SignFormInputs = {
  billingname: string;
  email: string;
  phone: string;
};

function SignupForm({ onNext, watch, register, handleSubmit, errors }: any) {
  const { billingname, email, phone } = watch();

  const handler: SubmitHandler<SignFormInputs> = () => {
    onNext();
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
            className="font-semibold	 text-gray-600 text-[30px] "
          >
            Sign Up
          </Typography>
          <div className="text-gray-500 mt-2 ml-0.5">
            Welcome Back! Please enter your details.
          </div>
        </div>
        <form onSubmit={handleSubmit(handler)} className="">
          {/** name */}
          <div className="mt-3">
            <FormInputField
              required={true}
              register={register}
              type={"text"}
              placeholder={"Enter your name..."}
              fieldName={"billingname"}
              labelName={"Name"}
              labelClassName={"text-md text-gray-500 mt-3"}
              className="h-[62px] border-2 mt-3 border-gray-300 placeholder-gray-400 placeholder:text-sm text-md w-full rounded-[7px]  focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent"
            />
            {errors.billingname && (
              <span className="text-red-500">{errors.billingname.message}</span>
            )}
          </div>

          {/* email*/}
          <div className="mt-3">
            <FormInputField
              required={true}
              register={register}
              type={"email"}
              placeholder={"Enter your email..."}
              fieldName={"email"}
              labelName={"Email"}
              labelClassName={"text-md text-gray-500 mt-5"}
              className="h-[62px] border-2 mt-3 border-gray-300 placeholder-gray-400 placeholder:text-sm text-md w-full rounded-[7px]  focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent"
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>
          {/** Phone */}
          <div className="mt-3">
            <FormNumberTypeInputField
              required={true}
              maxLength={10}
              register={register}
              type={"text"}
              placeholder={"Enter your number..."}
              fieldName={"phone"}
              labelName={"Phone"}
              labelClassName={"text-md text-gray-500 "}
              className="h-[62px] border-2 border-gray-300 placeholder-gray-400 placeholder:text-sm text-md w-full rounded-[7px] mt-[10px] focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent"
            />
            {errors.phone && (
              <span className="text-red-500 ">{errors.phone.message}</span>
            )}
          </div>

          <div className="mt-5 text-white flex gap-3">
            <Button
              type="submit"
              disabled={!(billingname && EmailValidation(email) && phone)}
              className="rounded-md p-2.5 text-base font-medium bg-button-clr-400 hover:bg-[#7FA9E6] h-12 w-full "
            >
              Next
            </Button>
          </div>
        </form>
        <Seperater width="70%" />
        <CreateNewAccountCTA
          name={"Click here"}
          labelName={"Already have an account? "}
          route={"/login"}
        />
      </div>
    </div>
  );
}

export default SignupForm;
