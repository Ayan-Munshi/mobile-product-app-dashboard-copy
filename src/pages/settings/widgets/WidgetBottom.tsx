import DynamicRadio from "@/components/custom/DynamicRadio";
import FormNumberTypeInputField from "@/components/custom/FormNumberTypeInputField";
import { Typography } from "@/components/custom/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useForm, Controller } from "react-hook-form";

const WidgetBottom = ({ generalDetailsData, handleConversionLink }: any) => {
  const radioOption = [
    "Show default confirmation page",
    "Redirect to custom link",
  ];
  const { register, watch, control, handleSubmit } = useForm({
    defaultValues: {
      redirectionurl: generalDetailsData?.redirection_url,
      redirectiondelay: generalDetailsData?.redirection_delay,
      formUrl: "",
      useCustomLink: Boolean,
      conversionTracking:
        generalDetailsData?.to_redirect === true
          ? "Redirect to custom link"
          : "Show default confirmation page",
    },
  });

  // useEffect(() => {
  //   if (generalDetailsData?.to_redirect) {
  //     setValue("conversionTracking", "Redirect to custom link");
  //   } else {
  //     setValue("conversionTracking", "Show default confirmation page");
  //   }
  // }, [generalDetailsData?.to_redirect]);

  const handleUpdate = () => {
    const modifiedConversionTracking = conversionTracking.includes(
      "Redirect to custom link"
    )
      ? true
      : false;

    handleConversionLink({
      redirectionurl,
      redirectiondelay,
      id: generalDetailsData?.id,
      conversionTracking: modifiedConversionTracking,
    }).unwrap();
  };

  const { conversionTracking, redirectiondelay, redirectionurl } = watch();

  const durationChecker =
    redirectiondelay && /^[0-9]+$/.test(redirectiondelay)
      ? Number(redirectiondelay) >= 0 && Number(redirectiondelay) <= 20
      : false;

  return (
    <form className="" onSubmit={handleSubmit(handleUpdate)}>
      <div className="">
        <Typography as="h2" className="text-[18px] font-medium">
          Conversion Tracking
        </Typography>
        <p className="text-[16px] text-gray-400 mt-2">
          Choose the link where you would like to direct the user next.
        </p>
        <div className="block gap-4 mt-5">
          {radioOption.map((link, index) => (
            <Controller
              key={index}
              name="conversionTracking"
              control={control}
              defaultValue="New Patient"
              rules={{ required: "Please select patient status" }}
              render={({ field }) => (
                <DynamicRadio
                  text={link}
                  index={index}
                  selectedPractice={conversionTracking}
                  setValue={(value) => field.onChange(value)}
                />
              )}
            />
          ))}

          <div className="ml-8">
            <div className="mt-6 max-w-[404px] w-full">
              <Label className="text-base font-normal text-[#3F3F3F]">
                Link
              </Label>
              <Controller
                name="redirectionurl"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "URL is required",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <div>
                    <Input
                      className="text-md mt-3 rounded-[10px] h-[58px]  focus-visible:ring-transparent focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:border-2 border-2"
                      disabled={
                        conversionTracking === "Redirect to custom link"
                          ? false
                          : true
                      }
                      type="text"
                      id={field.name}
                      tabIndex={0}
                      placeholder="Enter your redirection url"
                      {...field}
                      onChange={(e) => {
                        const target = e.target as HTMLInputElement;
                        const newValue = target.value;

                        // Prevent typing anything unless the URL starts with 'https://'
                        if (newValue.startsWith("https://")) {
                          field.onChange(e); // Allow updating the value if valid
                        } else {
                          // Keep the value starting with 'https://'
                          target.value = "https://";
                          field.onChange({ target }); // Force updating to 'https://'
                        }
                      }}
                    />
                    {error && <p style={{ color: "red" }}>{error.message}</p>}
                  </div>
                )}
              />
            </div>

            <div className="mt-6 relative  max-w-[300px] w-full">
              <FormNumberTypeInputField
                maxLength={2}
                labelName="Redirection Delay(0-20 Seconds)"
                readOnlyField={
                  conversionTracking === "Redirect to custom link"
                    ? false
                    : true
                }
                register={register}
                type="text"
                placeholder="Enter your preferred delay time"
                fieldName="redirectiondelay"
                required={true}
                labelClassName="text-base font-normal text-[#3F3F3F] whitespace-nowrap"
                className={
                  "text-md mt-3 rounded-[10px] h-[58px]  focus-visible:ring-transparent focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:border-2 border-2"
                }
              />
              {redirectiondelay && (!durationChecker || !redirectiondelay) ? (
                <div className="absolute bg-white min-w-[300px]">
                  <p className="text-red-500 text-sm mt-1 ">
                    Please enter a value between 0 and 20 seconds.
                  </p>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-end w-full">
        <Button
          disabled={
            (conversionTracking === "Redirect to custom link" &&
              generalDetailsData?.to_redirect &&
              redirectiondelay === generalDetailsData?.redirection_delay &&
              generalDetailsData?.redirection_url === redirectionurl) ||
            (conversionTracking === "Show default confirmation page" &&
              generalDetailsData?.to_redirect == false)
              ? true
              : false
          }
          type="submit"
          className="bg-[#6995fe] flex gap-1 font-normal text-md text-white h-[49px] py-1 px-6 rounded-[7px] hover:bg-[#6995fe]"
        >
          <Icon icon="mingcute:save-line" className="text-white" />
          Submit
        </Button>
      </div>
    </form>
  );
};

export default WidgetBottom;
