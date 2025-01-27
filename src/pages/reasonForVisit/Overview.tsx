import { Icon } from "@iconify/react/dist/iconify.js";
import settingsLinear from "@iconify/icons-solar/settings-linear"; // Settings icon
import { Typography } from "@/components/custom/Typography";
import OverviewCard from "./OverviewCard";

const Overview = () => {
  return (
    <>
      <Typography as="div" className="flex justify-between p-7">
        <Typography as="h2" className="text-[#000000] font-medium text-[24px]">
          Overview
        </Typography>
        <Icon
          icon={settingsLinear}
          style={{ width: "23px", height: "23px", color: "#3E3E3E" }}
        />
      </Typography>
      <hr />

      <OverviewCard
        leftHeader="Reasons"
        dropdownLabel="7 Active"
        leftIcon={<Icon icon="tabler:dental" className="text-[24px] mr-2" />}
      />
      <OverviewCard
        leftHeader="Providers"
        dropdownLabel="3/5 Enabled"
        leftIcon={
          <Icon
            icon="healthicons:doctor-outline"
            className="text-[24px] mr-2"
          />
        }
      />
    </>
  );
};

export default Overview;
