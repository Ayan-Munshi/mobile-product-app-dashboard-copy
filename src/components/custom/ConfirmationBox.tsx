import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Typography } from "./Typography";
type AppProps = {
  isOpen: boolean;
  onClose: (data: boolean) => void;
  handleSubmit: () => void;
  headingText?: string;
  declineBtnText?: string;
  detailsText?: string;
  acceptBtnText?: string;
  maxWidth?: string;
};
const ConfirmationBox = ({
  isOpen,
  onClose,
  handleSubmit,
  headingText = "Heading",
  detailsText,
  acceptBtnText = "Done",
  declineBtnText = "Cancel",
  maxWidth,
}: AppProps) => {
  return (
    //max-w-[min(50%,500px)]
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`relative  ${maxWidth} min-h-[20vh]  border p-[40px] overflow-y-auto max-h-screen [&>button]:hidden focus-visible:outline-none focus-visible:ring-0 border-none `}
      >
        <DialogHeader className="">
          <DialogTitle className="focus-visible:ring-transparent font-medium text-center w-full">
            <Typography
              as="h1"
              className="text-[26px] font-medium text-[#575757]"
            >
              {headingText}
            </Typography>
          </DialogTitle>
        </DialogHeader>
        <Typography
          as="p"
          className="text-gray-500 text-base text-center font-normal text-wrap mt-[25px] "
        >
          {detailsText}
        </Typography>

        <div className="w-full  mt-5 flex justify-center gap-2 flex-wrap">
          <DialogClose asChild>
            <button className="bg-white text-base max-w-[160px] w-full h-[46px] text-black border border-gray-500 rounded-md py-1 px-3">
              {declineBtnText}
            </button>
          </DialogClose>

          <button
            className="bg-blue-400 max-w-[160px] w-full h-[46px] text-base text-white border border-blue-400 rounded-md py-1 px-3 "
            onClick={handleSubmit}
          >
            {acceptBtnText}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationBox;
