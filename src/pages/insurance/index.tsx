import InsuranceSetup from "./InsuranceSetup";
import { Typography } from "@/components/custom/Typography";

const Insurance = () => {
  return (
    <div id="insurance" className="m-10 bg-white ">
      <div className="border-b p-5">
        <Typography as="h2" className="text-black font-medium text-[24px]">
          Insurance
        </Typography>
      </div>
      <div className="w-[70%] ">
        <InsuranceSetup />
      </div>
    </div>
  );
};

export default Insurance;
