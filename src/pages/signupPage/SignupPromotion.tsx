import { Icon } from "@iconify/react/dist/iconify.js";

export default function SignupPromotion() {
  return (
    <div
      id="signupPromotion"
      className=" relative z-1 text-[#EAF2FF] flex flex-col justify-center items-center w-full  h-full"
    >
      <Icon
        icon="zondicons:arrow-up"
        className="text-white absolute top-5 left-20 z-2 size-28 transform -translate-x-1/2 opacity-20 "
      />

      <div className="xl:w-[65%] md:w-[50%] w-[40%] ">
        <p className="2xl:text-[55px] lg:text-[50px] text-[40px] leading-[70px] font-bold break-words ">
          Never lose another <span className="text-[#9FEEFD]">Patient </span>.
          Your 24/7
          <span className="text-[#9FEEFD]"> Scheduling Link </span>.
        </p>
        <p className="lg:text-md md:text-sm  font-normal mt-[15px] lg:leading-8 break-words">
          With All in One Dental, appointments are automatically synced into
          your PMS based on your schedules and availability.
        </p>
      </div>
    </div>
  );
}
