import DynamicCheckBoxDropDown from "@/components/custom/DynamicCheckBoxDropDown";
import SkeletonInsuranceList from "@/components/custom/skeletons/SkeletonInsuranceList";
import { Typography } from "@/components/custom/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { dentalInsuranceList } from "@/constant/insuranceDropdownOption";
import {
  useGetGeneralSettingDataQuery,
  useUpdateInsuranceInformationMutation,
} from "@/redux/practiceDashBoard/apiSlice";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Skeleton from "react-loading-skeleton";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

const InsuranceSetup = () => {
  const { watch, setValue, register, control } = useForm<any>({
    defaultValues: {
      selectedOptions: [],
      newCustomInsurance: "",
    },
  });
  const { selectedOptions, newCustomInsurance } = watch();
  const [selectedInsurance, setSelectedInsurance] = useState<string[]>([]);
  //getting data from redux
  const persistPracticeId = useSelector(
    (state: any) => state?.persisted?.practice?.persistPracticeDetails?.id
  );

  // Api call
  //getting data from db
  const { data: generalDetailsData = {}, isFetching } =
    useGetGeneralSettingDataQuery(
      {
        practiceId: persistPracticeId,
      },
      { skip: !persistPracticeId }
    );
  const [updateInsuranceInformation] = useUpdateInsuranceInformationMutation();

  useEffect(() => {
    if (selectedOptions?.length) {
      setSelectedInsurance(selectedOptions);
    }
  }, [selectedOptions]);

  useEffect(() => {
    if (generalDetailsData?.result?.insurances?.length) {
      setValue("selectedOptions", generalDetailsData?.result?.insurances);
      setSelectedInsurance(generalDetailsData?.result?.insurances);
    } else {
      setValue("selectedOptions", []);
      setSelectedInsurance([]);
    }
  }, [generalDetailsData?.result?.insurances]);

  const handleSubmitInsuranceInformation = async () => {
    try {
      const finalData = {
        selectedInsurance,
        practiceId: persistPracticeId,
      };
      const result: any = await updateInsuranceInformation(finalData).unwrap();
      if (result?.success) {
        toast.success(result?.message || "Updated successfully!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to Update");
    }
  };

  const handleAddCustomInsurance = () => {
    setSelectedInsurance([...selectedInsurance, newCustomInsurance]);
    setValue("newCustomInsurance", "");
  };

  const deleteInsurance = (insurance: string) => {
    const filterInsurace = selectedInsurance?.filter(
      (item: string) => item != insurance
    );
    setValue("selectedOptions", [...filterInsurace]);
    setSelectedInsurance(filterInsurace);
  };

  return (
    <div className=" bg-white flex flex-col ">
      <div className="">
        <div className="m-10">
          <div className="border-2 rounded-[5px]">
            <div className="flex items-start pt-10 px-10  ">
              {/* search field */}
              <div className="w-1/2 ">
                <div className="w-[90%]">
                  {isFetching ? (
                    <div className="flex items-center px-2 h-[52px] border-2 border-gray-200 rounded-[7px]">
                      <Skeleton height={15} width={100} />
                    </div>
                  ) : (
                    <Controller
                      name="selectedOptions"
                      control={control}
                      defaultValue={[]} // Ensure default value is an array
                      render={({ field }) => (
                        <DynamicCheckBoxDropDown
                          name="selectedOptions"
                          control={control}
                          options={dentalInsuranceList}
                          //This filters the selected insurance IDs and counts how many of them are found in the dentalInsuranceList
                          label={`${
                            field.value?.filter((item: string) =>
                              dentalInsuranceList?.some(
                                (insurance: { id: string; label: string }) =>
                                  insurance?.id == item
                              )
                            )?.length || 0
                          } Selected`}
                        />
                      )}
                    />
                  )}
                  <Typography as="p" className="mt-2 text-gray-400 font-medium">
                    Select list of insurances from our list.If you can't find
                    one, you can enter it manually using the text box to right.
                  </Typography>
                </div>
              </div>

              {/* input field for name */}
              <div className="  w-1/2 ">
                <div className=" flex gap-2">
                  <Input
                    {...register("newCustomInsurance", {
                      required: true,
                    })}
                    type="text"
                    id="newCustomInsurance"
                    className="h-[52px] border-2 rounded-[6px]  focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-transparent mt-[10px] md:mt-[0px] placeholder:text-gray-400 placeholder:text-base"
                    tabIndex={0}
                    placeholder="New custom insurance"
                  />

                  <Button
                    onClick={handleAddCustomInsurance}
                    disabled={!newCustomInsurance}
                    className="bg-blue-400 min-w-[70px]  h-[50px] text-[16px] text-white border border-blue-400 hover:bg-blue-400 rounded-md py-1 px-3 cursor-pointer"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
            <div className="px-10 pb-10 mt-8">
              <Typography
                as="h2"
                className="text-black font-medium text-[22px]"
              >
                List of Insurance
              </Typography>
              <div className="bg-white mt-3">
                <div className="flex items-center px-2 py-3  bg-[#d6d4d461] h-[60px]  border border-[#d6d4d461]">
                  <Typography as="h3" className=" font-[550] ">
                    Insurance name
                  </Typography>
                </div>
                <ul className="">
                  {isFetching ? (
                    <SkeletonInsuranceList />
                  ) : selectedInsurance?.length > 0 ? (
                    selectedInsurance?.map(
                      (insurance: string, index: number) => (
                        <li
                          key={index}
                          className="px-2 h-[60px] flex items-center justify-between border-b border-x bg-white hover:bg-neutral-100/50"
                        >
                          {insurance}

                          <button
                            onClick={() => deleteInsurance(insurance)}
                            className="bg-red-100 rounded-full font-[700]"
                          >
                            <Icon
                              icon="basil:cross-outline"
                              width="25"
                              height="25"
                              className="text-red-500 "
                            />
                          </button>
                        </li>
                      )
                    )
                  ) : (
                    <li className="px-2 h-[60px] flex items-center border-b border-x bg-white">
                      <span className="text-black">no insurance</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSubmitInsuranceInformation}
              className="bg-blue-400 max-w-[120px] w-full h-[46px] text-[16px] text-white border border-blue-400 rounded-md py-1 px-3 "
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default InsuranceSetup;
