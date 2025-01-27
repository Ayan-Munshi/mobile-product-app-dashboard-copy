import { cn } from "@/lib/utils";

type AppProps = {
  BtnText?: string;
  className?: string;
  disable?: boolean;
};

const CustomButton = ({ BtnText = "save", className, disable }: AppProps) => {
  return (
    <button
      type="submit"
      disabled={disable}
      className={cn(
        "bg-[#769FFD] text-base h-[49px] px-5 py-2 rounded-md",
        disable ? "opacity-60" : "opacity-100",
        className
      )}
    >
      {BtnText}
    </button>
  );
};

export default CustomButton;
