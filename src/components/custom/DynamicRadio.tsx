import { Input } from "../ui/input";

type AppProps = {
  imageVisible?: boolean;
  text: string;
  index: number;
  selectedPractice: string | undefined;
  setValue: (value: string) => void;
  classNameProps?: string;
  image?: string;
};
const DynamicRadio = ({
  text,
  index,
  selectedPractice,
  setValue,
}: AppProps) => {
  return (
    <div
      className={`flex border-[2px] outline-offset-1 outline-[#6996FE] mt-6 items-center box-border whitespace-nowrap cursor-pointer rounded
            ${
              selectedPractice === text
                ? "bg-[#6996FE]  size-3 outline outline-1 outline-blue-300 outline-offset-1"
                : "bg-white size-3 text-black border-1 border-blue-300"
            }`}
      style={{ gridColumn: index >= 3 ? "span 1 / span 1" : "auto" }}
      onClick={() => setValue(text)}
    >
      {/* Radio input hidden with ShadCN */}
      <Input type="radio" value={text} className="hidden" />
      {/* Optional image */}
      <span className=" text-base text-[#3F3F3FE8] ml-[30px] text-black ">
        {text}
      </span>
    </div>
  );
};

export default DynamicRadio;
