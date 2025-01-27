import { useEffect, useState } from "react";
import SignupForm from "./SignupForm";
import SignupForm2 from "./SignupForm2";
import SignupForm3 from "./SignupForm3";
import SignupPromotion from "./SignupPromotion";
import { useForm } from "react-hook-form";
import { useUserSignupMutation } from "@/redux/practiceDashBoard/apiSlice";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleBack = () => {
    setCurrentStep((prevStep) => prevStep - 1); // back button logic
  };

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      billingname: "",
      email: "",
      password: "",
      accesscode: "",
      phone: "",
      streetaddress: "",
      practiceCity: "",
      practiceState: "",
      practiceCountry: "USA",
      practiceZipCode: "",
      termsAccepted: false,
    },
  });

  const handleNext = () => {
    // next button logic
    switch (currentStep) {
      case 1:
        setCurrentStep(2);
        break;
      case 2:
        setCurrentStep(3);
        break;
      default:
        break;
    }
  };

  const [userSignup, { error, data }] = useUserSignupMutation(); // from apislice

  const handleFormSubmit = (data: any) => {
    userSignup({ ...data }); //sending all 3 steps data to userSignup api
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (data) {
      toast.success("Registered Successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else if (error) {
      toast.error(`Error: ${error.message || "Something went wrong"}`);
    }
  }, [data, error, navigate]);

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SignupForm
            onNext={handleNext}
            watch={watch}
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
          />
        );
      case 2:
        return (
          <SignupForm2
            onNext={handleNext}
            onBack={handleBack}
            watch={watch}
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            control={control}
          />
        );
      case 3:
        return (
          <SignupForm3
            onBack={handleBack}
            watch={watch}
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            onSignUp={handleFormSubmit}
            // control={control}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div id="signup" className="flex min-h-screen w-full">
      <div className="flex justify-center lg:w-1/2 w-full">
        {renderFormStep()}
      </div>

      <div className="lg:w-1/2 md:flex items-center justify-center hidden bg-brand-bg-color p-4">
        <SignupPromotion />
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

export default Signup;
