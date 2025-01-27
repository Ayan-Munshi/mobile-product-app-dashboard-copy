import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Typography } from "@/components/custom/Typography";
import { Icon } from "@iconify/react/dist/iconify.js";

type AppProps = {
  dropdownLabel: string;
  leftHeader: string;
  leftIcon: any;
};

const OverviewCard = ({ dropdownLabel, leftHeader, leftIcon }: AppProps) => {
  return (
    <Typography
      as="div"
      className="flex justify-between p-4 bg-gradient-to-b from-[#5488FF] to-[#7DA4FC] rounded-[6px] m-4"
    >
      <Typography
        as="div"
        className="flex border-r-2 pr-[18%] ml-3 items-center text-[#000000] font-medium text-[18px] text-white"
      >
        {leftIcon}
        <span>{leftHeader}</span>
      </Typography>
      <Typography
        as="div"
        className="flex items-center justify-around w-[50%] text-[#000000] font-medium text-[18px] text-white"
      >
        <span>{dropdownLabel}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Icon icon="gridicons:dropdown" className="text-[25px]" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={"position"}>
              <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom">
                Bottom
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Typography>
    </Typography>
  );
};

export default OverviewCard;
