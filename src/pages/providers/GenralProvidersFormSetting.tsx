import React, { ReactNode, useEffect, useState } from "react";
import DynamicCheckBoxDropDown from "@/components/custom/DynamicCheckBoxDropDown";
import FormInputField from "@/components/custom/FormInputField";
import SelectDropDown from "@/components/custom/SelectDropDown";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { InputFormValuesType } from "./EditProvidersDetails";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FormRadioField from "@/components/custom/FormRadioField";
import { useGetOperetoriesListQuery } from "@/redux/practiceDashBoard/apiSlice";
import { useSelector } from "react-redux";
import { Typography } from "@/components/custom/Typography";

type AppProps = {
  control: Control<InputFormValuesType>;
  register: UseFormRegister<InputFormValuesType>;
  errors: FieldErrors<InputFormValuesType>;
  watch: () => InputFormValuesType;
  setValue: (
    name: keyof InputFormValuesType,
    value: InputFormValuesType[keyof InputFormValuesType]
  ) => void;
  formData: any;
  handleCheckUncheckOperatoriesToast: () => void;
};

const roleOption = [
  {
    id: "doctor",
    label: "Doctor",
  },
  {
    id: "hygienist",
    label: "Hygienist",
  },
];

const items = [
  {
    id: "Male",
    label: (
      <Icon icon="healthicons:doctor-male-outline" height="auto" width="30px" />
    ),
  },
  {
    id: "Female",
    label: (
      <Icon
        icon="healthicons:doctor-female-outline"
        height="auto"
        width="30px"
      />
    ),
  },
  {
    id: "Other",
    label: (
      <Icon icon="healthicons:doctor-outline" height="auto" width="30px" />
    ),
  },
];

const GenralProvidersFormSetting = ({
  control,
  register,
  watch,
  setValue,
  formData,
  handleCheckUncheckOperatoriesToast,
}: AppProps) => {
  // destructuring data from watch
  const { operatories = [], role, providerProfile, gender } = watch();
  const persistPracticeId = useSelector(
    (state: any) => state?.persisted?.practice?.persistPracticeDetails?.id
  );

  const matchedItem = items?.find(
    (data: { id: string; label: ReactNode }) => data.id === gender
  );

  const [operatoriesOption, setOperatoriesOption] = useState<any[]>([]);
  const { data: operetoriesList = [] } = useGetOperetoriesListQuery({
    practiceId: persistPracticeId,
  });

  useEffect(() => {
    if (operetoriesList?.result) {
      const operetoriesData = operetoriesList?.result?.map(
        (operatorie: any) => {
          return {
            label: operatorie?.name,
            id: operatorie?.id,
          };
        }
      );

      setOperatoriesOption(operetoriesData);
    }
  }, [operetoriesList?.result]);

  return (
    <>
      <div className=" col-start-1 col-end-8 mt-5">
        <div className="flex items-center mt-4 space-x-5">
          <div className="text-lg w-3/6">
            {/* {formData?.name} */}
            <Typography as="h4" className="text-md text-gray-700 font-normal">
              Provider Image
            </Typography>
            <p className="text-sm text-gray-500 mt-2">
              Upload an image in a square format with dimensions of 256 x 256
              pixels.
            </p>
          </div>
          <Avatar className="h-[70px] w-[70px] rounded-slate-300-full border border-gray-400 object-cover aspect-square bg-slate-300 ">
            <AvatarImage src={providerProfile ? providerProfile : ""} />
            {
              <AvatarFallback>
                {matchedItem?.label ? (
                  React.cloneElement(matchedItem.label, {
                    className: "h-12 w-12 text-gray-400", // Apply class to the label if it exists
                  })
                ) : (
                  <Icon
                    icon="fa6-solid:user-doctor"
                    className="h-12 w-12 text-gray-400"
                  />
                )}
              </AvatarFallback>
            }
          </Avatar>
          <Button
            type="button"
            variant="ghost"
            className="h-auto p-0 ml-5 hover:bg-transparent text-md text-gray-700 font-normal"
            onClick={(e) => {
              e.preventDefault();
              document?.getElementById("fileInput")?.click();
            }}
          >
            {providerProfile ? "Update" : "Add"}
          </Button>
          {providerProfile ? (
            <Button
              type="button"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                setValue("providerProfile", null);
              }}
              className="h-auto p-0 ml-5 text-red-500 hover:bg-transparent text-md font-normal"
            >
              Remove
            </Button>
          ) : null}
          <Input
            type="file"
            id="fileInput"
            {...register("providerProfile", {
              onChange: (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const previewUrl = URL.createObjectURL(file);
                  // Store both the file and its preview URL in form data
                  setValue("providerProfile", previewUrl); // stores the actual file array
                  setValue("providerFile", file); // stores the actual file array
                  // setValue("providerProfilePreview", previewUrl); // stores the preview URL
                }
              },
            })}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>
      </div>

      <div className="col-start-9 col-end-13 mt-9">
        <Label className="text-md text-gray-700 font-normal">Gender</Label>
        <div className="flex gap-4 mt-3">
          {items?.map((item) => (
            <Controller
              key={item.id}
              name="gender"
              control={control}
              render={({ field }) => {
                const isChecked = field.value === item.id;
                return (
                  <FormRadioField
                    item={{
                      ...item,
                      label: React.cloneElement(item.label, {
                        className: `text-gray-500 ${
                          isChecked ? "text-white" : ""
                        }`,
                      }),
                    }}
                    isChecked={isChecked}
                    onChange={() =>
                      field.onChange(item.id === field.value ? null : item.id)
                    }
                    className={`flex h-[3rem] w-[3rem] text-md ${
                      isChecked ? "border-[#6897ff]" : "border-gray-400"
                    } gap-3 justify-center items-center cursor-pointer rounded-lg ${
                      isChecked
                        ? "bg-[#6897ff] text-white"
                        : "bg-[#ededed] text-black"
                    }`}
                  />
                );
              }}
            />
          ))}
        </div>
      </div>

      <div className="col-start-1 col-end-4  ">
        <FormInputField
          register={register}
          type="text"
          placeholder="Enter display name..."
          fieldName="providerDisplayName"
          labelName="Provider display Name"
          // required={true}
          labelClassName="text-md  text-gray-700 font-normal mt-4"
          className="p-6 pl-2 pr-2 text-md  border-2 border-gray-300 rounded-[7px]  mt-3  focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent"
        />
        {/* {errors.providerDisplayName && (
          <span className="text-red-500 text-sm">
            Provider name is required
          </span>
        )} */}
      </div>

      {/* providers dropdown */}
      <div className="col-start-5 col-end-8">
        <Label className="flex items-center font-medium text-[18px] mb-3">
          <Icon
            icon="healthicons:doctor-outline"
            className="text-[24px] text-gray-700 mr-2"
          />
          <span className="text-gray-700 font-normal text-md required-field">
            Operatories
          </span>
        </Label>
        <DynamicCheckBoxDropDown
          name="operatories"
          control={control}
          options={operatoriesOption || []}
          label={`${operatories?.length}/${operatoriesOption?.length} Operatories`}
          formData={formData}
          handleCheckUncheckOperatoriesToast={
            handleCheckUncheckOperatoriesToast
          }
        />
      </div>

      {/* Operatories dropdown  */}
      <div className="col-start-9 col-end-12 capitalize ">
        <Label className="flex items-center font-medium text-[18px] mb-3">
          <Icon
            icon="healthicons:doctor-outline"
            className="text-[24px] mr-2 text-gray-700"
          />
          <span className="text-gray-700 font-normal text-md ">Role</span>
        </Label>
        <SelectDropDown
          name="role"
          control={control}
          options={roleOption}
          selected={role?.label}
        />
      </div>
      {/* who can book appointment */}

      <div className=" col-span-12">
        <Label
          htmlFor="bio"
          className="block text-md mb-3 font-normal text-gray-700 "
        >
          Bio
        </Label>
        <Textarea
          id="bio"
          placeholder="Enter providor's bio"
          {...register("bio")}
          className="p-4 border-2 text-md border-gray-300 rounded-2 h-32 mt-[6px] focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent"
        />
      </div>
    </>
  );
};

export default GenralProvidersFormSetting;
