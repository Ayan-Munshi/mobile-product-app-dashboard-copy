import FormInputField from "@/components/custom/FormInputField";
import { Typography } from "@/components/custom/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useDebounce from "@/customHooks/useDebounce";
import { useUniqueFormCheckQuery } from "@/redux/practiceDashBoard/apiSlice";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import ClipboardJS from "clipboard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const WidgetTop = ({ generalDetailsData, handleSchedulingLink }: any) => {
  const { register, watch, handleSubmit } = useForm({
    defaultValues: {
      formUrl: generalDetailsData?.form_url,
      useCustomLink: generalDetailsData?.use_form_url,
    },
  });
  const domainURL = import.meta.env.VITE_DOMAIN;
  const { formUrl, useCustomLink } = watch();

  const debouncedFormUrl = useDebounce(formUrl, 500); // applying debouncing to formUrl
  const {
    error,
    data: urlAvalible = { message: "" },
    isFetching: isLoading = false,
  } = useUniqueFormCheckQuery(
    {
      url: debouncedFormUrl, // use debounced value for the query
    },
    { skip: !debouncedFormUrl || generalDetailsData?.form_url == formUrl }
  );

  // for clipboard
  useEffect(() => {
    const clipboard = new ClipboardJS(".copy-button");
    return () => {
      clipboard.destroy();
    };
  }, []);

  const submitLinkUpdate = () => {
    handleSchedulingLink({
      formUrl,
      id: generalDetailsData?.id,
      useCustomLink,
    });
  };

  return (
    <div id="widget">
      <div className="">
        <Typography as="h1" className="text-xl text-[#535353] font-medium ">
          Widgets
        </Typography>
        <Typography as="h2" className="text-[18px] mt-6 font-medium">
          Scheduling Link
        </Typography>
        <Typography as="p" className="text-[16px] text-gray-400 mt-2">
          Choose the link you would like users to use for booking the
          appointment
        </Typography>
        <Typography as="h2" className="text-[18px] mt-6 font-normal">
          Default link
        </Typography>
        <div className="flex w-full">
          <Typography as="p" className="text-[14px] text-gray-500 mt-2  ">
            {`${domainURL}/${generalDetailsData?.id}`}
          </Typography>

          <TooltipProvider delayDuration={10}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="bg-transparent hover:bg-transparent copy-button ml-1"
                  data-clipboard-text={`${domainURL}/${generalDetailsData?.id}`}
                  onClick={(event) => event.preventDefault()}
                >
                  <Icon
                    icon="mingcute:copy-line"
                    className="text-gray-400 hover:text-blue-300 size-5"
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-600 ">
                <Typography as="p" className="text-white">
                  Copy
                </Typography>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <form onSubmit={handleSubmit(submitLinkUpdate)} className="">
        <div className=" relative max-w-[600px] mt-6 ">
          <div className="flex items-center justify-start space-x-2 mt-2 ">
            <Input
              type="checkbox"
              id="useCustomLink"
              {...register("useCustomLink")}
              className="size-[12px]"
            />
            <label className="text-[16px] text-gray-700 font-normal">
              Use Custom Link
            </label>
          </div>

          <div className=" flex items-center mt-5 h-[58px] w-full rounded-[10px]  text-gray-500 border-[#CECECE] overflow-hidden">
            {generalDetailsData?.form_url !== formUrl && (
              <div className="absolute top-1 right-44">
                {isLoading && !urlAvalible?.message ? (
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                ) : (
                  <>
                    {error?.message ? (
                      <span className="text-red-500">{error.message}</span>
                    ) : (
                      <span
                        className={`flex items-center ${
                          urlAvalible?.message
                            ?.toLowerCase()
                            .includes("not available")
                            ? "text-red-500"
                            : "text-green-700"
                        }`}
                      >
                        {urlAvalible?.message
                          ?.toLowerCase()
                          .includes("not available") ||
                        !urlAvalible?.message ? (
                          ""
                        ) : generalDetailsData?.form_url === formUrl ? (
                          ""
                        ) : (
                          <Icon
                            icon="qlementine-icons:check-tick-16"
                            className="text-green-700 size-5 "
                          />
                        )}
                        {urlAvalible?.message}
                      </span>
                    )}
                  </>
                )}
              </div>
            )}

            <div className=" flex h-full border-2 border-[#E1E1E1] rounded-r-[7px] rounded-l-[7px]">
              <div className="px-3 bg-[#E1E1E1] flex items-center rounded-r-[10px 0px] testsdfsdf ">
                <Typography as="p" className="">
                  {`https://book...dental/ `}
                </Typography>
              </div>

              <FormInputField
                readOnlyField={useCustomLink ? false : true}
                register={register}
                type="text"
                placeholder=""
                fieldName="formUrl"
                regex={/[^a-z0-9-]/g}
                required={true}
                labelClassName="text-base font-semibold text-gray-700"
                className=" text-md h-full rounded-r-[10px] focus-visible:ring-transparent  focus-visible:ring-offset-0 border-none"
              />
            </div>

            <TooltipProvider delayDuration={10}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="bg-transparent hover:bg-transparent copy-button ml-[5px]"
                    data-clipboard-text={`${domainURL}/${formUrl}`} // Fixed interpolation
                    onClick={(event) => event.preventDefault()} // Prevent form submission
                  >
                    <Icon
                      icon="mingcute:copy-line"
                      className="text-gray-400 hover:text-blue-300 size-5"
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-600 ">
                  <Typography as="p" className="text-white">
                    Copy
                  </Typography>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="mt-7  flex justify-end w-full">
          <Button
            disabled={
              urlAvalible?.message?.toLowerCase().includes("not available") ||
              (generalDetailsData?.form_url === formUrl &&
              generalDetailsData?.use_form_url === useCustomLink
                ? true
                : false)
            }
            type="submit"
            className="bg-[#6995fe] flex gap-1 font-normal text-md text-white h-[49px] py-1 px-6 rounded-[7px] hover:bg-[#6995fe]"
          >
            <Icon icon="mingcute:save-line" style={{ color: "white" }} />
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WidgetTop;
