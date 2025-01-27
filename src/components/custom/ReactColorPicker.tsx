import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HexAlphaColorPicker } from "react-colorful";
import { HexColorInput } from "react-colorful";

const ReactColorPicker = ({
  selectedColor,
  setSelectedColor,
  buttonName,
}: any) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="bg-white text-black hover:bg-white text-base">
          {buttonName}
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" flex w-60 h-full bg-white rounded-[20px] border shadow-md ">
        <div className="flex flex-col gap-2 bg-transparent">
          <div className="">
            <HexAlphaColorPicker
              color={selectedColor}
              onChange={setSelectedColor}
              style={{
                height: "200px", // Customize the height
                width: "100%", // Customize the width if needed
              }}
            />
            <div className="flex gap-2 mt-3 bg-white  items-center">
              Hex:
              <HexColorInput
                color={selectedColor}
                onChange={setSelectedColor}
                alpha
                prefixed
                className="border p-2 rounded-[5px] w-full"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
      <style>{`
        .react-colorful {
          height: 240px; /* Change the height of the color picker */
        }
        .react-colorful__saturation {
          border-radius: 4px 4px 4px 4px ; /* Modify border radius */
          
        }
        .react-colorful__hue {
          height: 20px; /* Change the height of the hue bar */
          border-radius: 0 0 4px 4px; /* Modify border radius */
          margin-top: 4px

        }
        .react-colorful__hue-pointer {
          width: 15px; /* Change the width of the hue pointer */
          height: 15px; /* Adjust height if needed */
          border-radius: 100%; /* Modify border radius */
        }
        .react-colorful__alpha {
          height: 20px; /* Customize the height of the alpha bar */
          border-radius: 4px; /* Optional: Modify border radius */
          margin-top: 4px
        }
        .react-colorful__alpha-pointer {
          width: 15px; /* Customize the width of the alpha pointer */
          height: 15px; /* Adjust height if needed */
          border-radius: 100%; /* Optional: Modify border radius */
        }
      `}</style>
    </Popover>
  );
};

export default ReactColorPicker;
