import { Typography } from "@/components/custom/Typography";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useForm } from "react-hook-form";

const Review = () => {
  const { handleSubmit, watch, setValue, register } = useForm({
    defaultValues: {
      isAcceptingReview: true,
    },
  });
  const { isAcceptingReview } = watch();
  const handleReviewFormSubmit = () => {};

  return (
    <div id="review" className="m-10 p-6 bg-white">
      <div className="border-b p-5">
        <Typography as="h2" className="text-black font-medium text-[24px]">
          Review
        </Typography>
      </div>
      <form
        id="review-form"
        className="grid grid-cols-12"
        onSubmit={handleSubmit(handleReviewFormSubmit)}
      >
        <div className="col-start-1 col-end-4 flex gap-2 items-center mt-5 text-white ">
          <Checkbox
            id="isAcceptingReview"
            {...register("isAcceptingReview")}
            checked={isAcceptingReview}
            onCheckedChange={(checked: any) =>
              setValue("isAcceptingReview", checked)
            }
            className="data-[state=checked]:bg-blue-700 border-[#55575a] data-[state=checked]:border-blue-700"
          />

          <Label
            htmlFor="isAcceptingReview"
            className="text-md text-gray-700 font-normal cursor-pointer"
          >
            Accepting review
          </Label>
          {/* <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild className="">
                <Icon
                  icon="material-symbols:info-outline-rounded"
                  width="17"
                  height="17"
                  className="text-gray-400 cursor-pointer"
                />
              </TooltipTrigger>
              <TooltipContent className="text-[14px] font-[300] bg-gray-600 text-white max-w-[250px]">
                If turned off, patients will see a message: "This practice is
                not currently taking any appointments."
              </TooltipContent>
            </Tooltip>
          </TooltipProvider> */}
        </div>
        <div className="mt-5 col-start-1 col-end-4">
          <Button
            className="bg-[#6995fe] flex gap-1 font-normal text-md text-white h-[49px] py-1 px-7 rounded-[7px] hover:bg-[#6995fe]"
            type="submit"
            // disabled={isObjectValueChange}
          >
            <Icon icon="mingcute:save-line" className="text-white" />
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Review;
