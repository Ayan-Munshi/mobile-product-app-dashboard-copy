import DynamicCheckBoxDropDown from "@/components/custom/DynamicCheckBoxDropDown";
import FormCheckboxField from "@/components/custom/FormCheckboxField ";
import SelectDropDown from "@/components/custom/SelectDropDown";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import PopupHeader from "../../components/custom/PopupHeader";
import { cn } from "@/lib/utils";
import {
  useGetAppointmentTypeListQuery,
  useGetBlockoutTypeListQuery,
  useGetProvidersQuery,
} from "@/redux/practiceDashBoard/apiSlice";
import { useSelector } from "react-redux";
import _ from "lodash";
import SkeletonAddAndEditReasonForVisitData from "@/components/custom/skeletons/SkeletonAddAndEditReasonForVisitData";
import { Checkbox } from "@/components/ui/checkbox";
import { Typography } from "@/components/custom/Typography";
import { RootState } from "@/redux/store";
import FormInputFieldAlt from "@/components/custom/FormInputFieldAlt";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type CreateReasonPayload = Omit<InputFormValuesType, "id"> & {
  practiceId: string;
};
type UpdateReasonPayload = InputFormValuesType & {
  practiceId: string;
  id: string;
};
type AppProps = {
  open: boolean;
  fetching: boolean;
  type: string;
  onClose: () => void;
  formData: FormDataType;
  handleReasonUpdate: (data: CreateReasonPayload) => void;
  handleCreateReason: (data: UpdateReasonPayload) => void;
};

type FormDataType = {
  id?: string;
  name?: string;
  app_duration?: string;
  description?: string;
  min_age_limit?: number | string;
  max_age_limit?: number | string;
  appointment_type_id?: string;
  blockout_type_id?: string;
  appointment_type_name?: string;
  blockout_type_name?: string;
  is_active?: boolean;
  operatories?: { operatory_id: number }[];
  providers?: { provider_id: number }[];
  for_new_patients?: boolean;
  for_returning_patients?: boolean;
  to_show_providers?: boolean;
  use_block_scheduling?: boolean;
  blockout_free?: boolean;
  formData?: boolean;
  blockout_types: any;
};

export type InputFormValuesType = {
  inputField: string;
  reasonName: string;
  duration: string;
  activeReason: boolean;
  description: string;
  checkboxOption: string;
  dropdownField: string;
  appointmentType: { id: string; label: string };
  blockoutType: any[];
  patientStatus: any[];
  providers: any[];
  operatories: any[];
  autoSync: any[];
  toShowProvider: boolean;
  patientAge: {
    minAge: number | string;
    maxAge: number | string;
  };
};

const items = [
  {
    id: "newPatient",
    label: "New Patient",
  },
  {
    id: "returning",
    label: "Returning",
  },
];

const AddAndEditReasonForVisitData = ({
  open,
  onClose,
  type,
  formData,
  handleReasonUpdate,
  handleCreateReason,
  fetching,
}: AppProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    register,
  } = useForm<InputFormValuesType>({
    defaultValues: {
      reasonName: "",
      description: "",
      duration: "",
      patientAge: {
        minAge: "",
        maxAge: "",
      },
      //autoSync: [],
      patientStatus: [],
      providers: [],
      operatories: [],
      appointmentType: {
        id: "",
        label: "",
      },
      blockoutType: [],
      activeReason: false,
      toShowProvider: true,
    },
  });

  const {
    operatories,
    providers,
    appointmentType,
    blockoutType,
    duration,
    reasonName,
    toShowProvider,
  } = watch();
  const persistPracticeDetails = useSelector(
    (state: RootState) => state?.persisted?.practice?.persistPracticeDetails
  );

  const [providerOption, setProviderOption] = useState<any[]>([]);
  const [comparedObject, setComparedObject] = useState<any>({});
  const [isObjectValueChange, setIsObjectValueChange] =
    useState<boolean>(false);
  const [operatoriesOption, setOperatoriesOption] = useState<any[]>([]);
  const { data: appointmentTypeList = [], isFetching } =
    useGetAppointmentTypeListQuery({
      practiceId: persistPracticeDetails?.id,
    });
  const { data: blockoutTypeList = [] } = useGetBlockoutTypeListQuery({
    practiceId: persistPracticeDetails?.id,
  });

  const { data: providerList = [], isFetching: providerListIsFetching } =
    useGetProvidersQuery({
      practiceId: persistPracticeDetails?.id,
    });

  const blockoutTypeOptions = blockoutTypeList?.result?.map((item: any) => ({
    id: item?.id,
    label: item?.pms_item_name,
  }));
  const appointmentTypeOptions = appointmentTypeList?.result?.map(
    (item: any) => ({
      id: item?.id,
      label: item?.appointment_type_name,
    })
  );
  const watchedValue = watch();

  useEffect(() => {
    const isEqual = _.isEqual(comparedObject, watchedValue); // Deep comparison
    setIsObjectValueChange(isEqual); // Update state based on the comparison
  }, [watchedValue, comparedObject, operatoriesOption]);

  // For comparison or further processing
  useEffect(() => {
    if (formData?.id) {
      const updatedObject = handleSetFormDataValue(formData);
      setComparedObject(updatedObject);
    }
  }, [formData, open]);

  // Rearrange providors data
  useEffect(() => {
    if (providerList?.result) {
      const providerData = providerList?.result
        ?.filter((provider: any) => provider?.is_active)
        .map((provider: any) => ({
          label: `${provider?.pms_first_name || ""} ${
            provider?.pms_last_name || ""
          }`,
          id: provider?.id,
          ...provider,
        }));

      setProviderOption(providerData);
    }
  }, [providerList?.result]);

  //Operatory maping from provider
  useEffect(() => {
    if (providerOption) {
      const uniqueOperatories = [
        ...new Map(
          providerOption
            ?.filter((entry) => providers?.includes(entry.id))
            ?.flatMap((entry) => entry?.operatories)
            ?.map((operatory) => [operatory?.operatory_id, operatory])
        )?.values(),
      ]?.map((operatory) => ({
        label: operatory?.operatory_name,
        id: operatory?.operatory_id,
      }));
      setOperatoriesOption(uniqueOperatories);
    }
  }, [providers]);

  const onSubmit = (data: InputFormValuesType) => {
    if (appointmentType?.id || duration) {
      if (type === "Edit") {
        const payload: any = {
          ...data,
          practiceId: persistPracticeDetails?.id,
          id: formData?.id, // Ensure formData?.id is a valid string
        };
        handleReasonUpdate(payload);
      } else if (type === "Add") {
        const payload: any = {
          ...data,
          practiceId: persistPracticeDetails?.id,
        };
        handleCreateReason(payload);
      }
      onClose();
    }
  };

  function handleSetFormDataValue(formData: FormDataType | null) {
    if (!formData) return;
    // Create an updated state object
    const updatedState: Partial<InputFormValuesType> = {
      reasonName: formData?.name || "",
      duration: formData?.app_duration || "",
      description: formData?.description || "",
      patientAge: {
        minAge: formData?.min_age_limit || "",
        maxAge: formData?.max_age_limit || "",
      },
      appointmentType: {
        id: formData?.appointment_type_id || "",
        label: formData?.appointment_type_name || "",
      },
      blockoutType: formData?.blockout_free
        ? [
            "",
            ...formData?.blockout_types?.map(
              (item: any) => item?.blockout_type_id
            ),
          ]
        : formData?.blockout_types?.map(
            (item: any) => item?.blockout_type_id
          ) || [],
      // blockoutType: {
      //   id: formData?.blockout_type_id || "",
      //   label: formData?.blockout_type_name || "",
      // },
      activeReason: formData?.is_active ?? false,
      operatories:
        formData?.operatories?.map((item) => item?.operatory_id) || [],
      providers: formData?.providers?.map((item) => item?.provider_id) || [],
      toShowProvider: formData?.to_show_providers,
      patientStatus: [
        ...(formData?.for_new_patients ? ["newPatient"] : []),
        ...(formData?.for_returning_patients ? ["returning"] : []),
      ], // Remove null values
    };

    (
      Object.entries(updatedState) as [keyof InputFormValuesType, any][]
    ).forEach(([key, value]) => {
      if (value !== undefined) {
        setValue(key, value);
      }
    });

    return updatedState;
  }

  const handleCheckboxChange = (isChecked: boolean, field: any, item: any) => {
    if (isChecked) {
      field.onChange(field.value.filter((value: string) => value !== item.id));
    } else {
      field.onChange([...field.value, item.id]);
    }
  };

  // when provider will change, then adjust the operatories
  const handleProviderOnchange = (providersData: any) => {
    const uniqueOperatories = [
      ...new Map(
        providerOption
          ?.filter((entry) => providersData?.includes(entry.id))
          ?.flatMap((entry) => entry?.operatories)
          ?.map((operatory) => [operatory?.operatory_id, operatory])
      )?.values(),
    ]?.map((operatory) => ({
      label: operatory?.operatory_name,
      id: operatory?.operatory_id,
    }));
    const filterdata = uniqueOperatories
      ?.filter((op: any) => operatories?.includes(op?.id))
      ?.map((op: any) => op.id);
    setValue("operatories", filterdata);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[min(75%,1000px)] content-start border p-0 [&>button]:hidden ">
        <PopupHeader
          control={control}
          type={type}
          headerText={`${type === "Add" ? "Add" : "Edit"} Reason for visit`}
        />

        {fetching || isFetching || providerListIsFetching ? (
          <SkeletonAddAndEditReasonForVisitData />
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            id="form"
            className="grid grid-cols-12 px-9 py-5 border-t-2  "
          >
            <div className="col-start-1 col-end-4">
              <FormInputFieldAlt
                register={register}
                type="text"
                placeholder="Enter reason name..."
                fieldName="reasonName"
                labelName="Reason Name"
                required={true}
                labelClassName="text-md text-gray-700 font-normal required-field"
                inputClassName="h-[54px] pl-2 pr-2 text-md mt-2 border-2 border-gray-200 rounded-[7px] focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent"
                labelContainerClassName=" w-full flex gap-3 items-center"
                containerClassName=" w-full "
              />
              {errors.reasonName && (
                <span className="text-red-500 text-sm">
                  Reason name is required
                </span>
              )}
            </div>

            {/* providers dropdown */}
            <div className="col-start-5 col-end-8 ">
              <div>
                <Label className="flex items-center font-medium text-md mb-2">
                  <Icon
                    icon="healthicons:doctor-outline"
                    className="text-[24px] mr-2 text-gray-700"
                  />
                  <span className="text-gray-700 font-normal text-md required-field">
                    Providers
                  </span>
                </Label>
              </div>
              <DynamicCheckBoxDropDown
                name="providers"
                control={control}
                required={true}
                requiredMessage="Please select provider"
                options={providerOption}
                handleOnchange={handleProviderOnchange}
                label={`${providers?.length}/${providerOption?.length} Provider`}
              />
              {errors.providers && (
                <span className="text-red-500 text-sm">
                  {errors?.providers?.message}
                </span>
              )}
            </div>

            {/* Operatories dropdown  */}
            <div className="col-start-9 col-end-12">
              <Label className="flex items-center font-normal text-[18px] mb-2 ">
                <Icon
                  // icon="vaadin:dental-chair"
                  icon="healthicons:doctor-outline"
                  className="text-[24px] text-gray-600 mr-2"
                />
                <span className="text-gray-700 font-normal text-md required-field">
                  Operatories
                </span>
              </Label>
              <DynamicCheckBoxDropDown
                name="operatories"
                required={true}
                requiredMessage="Please select operatories"
                control={control}
                options={operatoriesOption || []}
                label={`${operatories?.length}/${operatoriesOption?.length} Operatories`}
              />
              {errors.operatories && (
                <span className="text-red-500 text-sm">
                  {errors?.operatories?.message}
                </span>
              )}
            </div>
            {/* who can book appointment */}
            <div className="col-start-1 col-end-4 mt-9 ">
              <Label className="text-md text-gray-700 font-normal required-field">
                Who can book?
              </Label>
              <div className="flex gap-4 mt-2 flex-wrap xl:flex-nowrap">
                {items.map((item) => (
                  <Controller
                    key={item.id}
                    name="patientStatus"
                    control={control}
                    rules={{
                      validate: (value) =>
                        (value && value.length > 0) ||
                        "Please select patient status",
                    }}
                    render={({ field }) => {
                      const isChecked = field.value.includes(item.id);
                      return (
                        <FormCheckboxField
                          item={item}
                          isChecked={isChecked}
                          onChange={() =>
                            handleCheckboxChange(isChecked, field, item)
                          }
                          className={cn(
                            "flex border-2 border-gray-300 min-h-[3rem] min-w-[130px] px-auto py-2 gap-3 justify-center items-center cursor-pointer rounded-[7px]",
                            {
                              "border-[#6897ff] bg-[#6897ff] text-white":
                                isChecked,
                              "border-gray-300 bg-white text-black": !isChecked,
                            }
                          )}
                        />
                      );
                    }}
                  />
                ))}
              </div>
              {errors.patientStatus && (
                <span className="text-red-500 text-sm">
                  {errors?.patientStatus?.message}
                </span>
              )}
            </div>

            {/* Reason duration */}
            <div className="col-start-5 col-end-8 mt-8 relative ">
              <FormInputFieldAlt
                register={register}
                type="text"
                placeholder="Enter duration"
                fieldName="duration"
                labelName="Duration (Mins)"
                maxLength={3}
                required={!appointmentType?.label ? true : false}
                labelClassName="text-md  font-normal  "
                inputClassName="h-[54px] pl-2 pr-2 text-md  border-2 border-gray-200 rounded-[7px] mt-2  focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent"
                regex={/[^0-9]/g}
                labelContainerClassName=" w-full flex gap-2 items-center"
                containerClassName="flex flex-col w-full"
                tooltipContent="Duration required if an appointment type is not selected. If an appointment type is selected, this field will override the duration of the appointment type."
                addIcon="ic:outline-watch-later"
              />
            </div>

            {/* appointmentType dropdown */}
            <div className="col-start-9 col-end-12 mt-8">
              <Label className="flex items-center font-medium text-[18px] mb-2">
                <Icon
                  icon="fluent:form-28-regular"
                  className="text-[24px] mr-2 text-gray-600 size-5"
                />
                <span className="text-gray-700 font-normal text-md">
                  Appointment Type
                </span>
              </Label>
              <SelectDropDown
                name="appointmentType"
                control={control}
                options={
                  appointmentTypeOptions
                    ? [
                        ...appointmentTypeOptions,
                        {
                          id: "",
                          label: "None",
                        },
                      ]
                    : []
                }
                selected={appointmentType?.label}
              />
            </div>

            {/* blockType dropdown */}
            <div className="col-start-1 col-end-4 mt-10">
              <div className="flex items-center gap-2 mb-2">
                <Label className="flex items-center font-medium text-[18px] ">
                  <span className="text-gray-700 font-normal text-md">
                    Blockout Type
                  </span>
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icon
                        icon="material-symbols:info-outline-rounded"
                        width="17"
                        height="17"
                        className="text-gray-400 cursor-pointer"
                      />
                    </TooltipTrigger>
                    <TooltipContent className="text-[14px] font-[300] bg-gray-600 text-white max-w-[290px]">
                      {`This feature needs to be turned on from Settings > Others. If selected, patients will see slots only within those dedicated blockouts.`}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <DynamicCheckBoxDropDown
                name="blockoutType"
                // required={true}
                control={control}
                disabled={!formData?.use_block_scheduling}
                options={
                  blockoutTypeOptions
                    ? [
                        ...blockoutTypeOptions,
                        {
                          id: "",
                          label: "Open Schedule",
                        },
                      ]
                    : []
                }
                label={`${blockoutType?.length}/${
                  blockoutTypeOptions?.length + 1
                } blockout`}
              />
              {/* <SelectDropDown
                name="blockoutType"
                control={control}
                disabled={!formData?.use_block_scheduling}
                options={
                  blockoutTypeOptions
                    ? [
                        ...blockoutTypeOptions,
                        {
                          id: "",
                          label: "None",
                        },
                      ]
                    : []
                }
                selected={blockoutType?.label}
              /> */}
            </div>
            {/* Patient Age duration */}
            <div className="col-start-5 col-end-8 mt-10">
              <Label className="text-md inline-block  text-gray-700 font-normal">
                Patient Age
              </Label>
              <div className="flex gap-5 items-center mt-3">
                <Input
                  id="minAge"
                  type="text"
                  maxLength={2}
                  placeholder=""
                  {...register("patientAge.minAge")}
                  className="p-1 w-[50px] text-center text-md border-2 border-gray-200 rounded-[7px]  focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent"
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.value = target.value.replace(/[^0-9]/g, "0");
                  }}
                />
                <span>To</span>
                <Input
                  id="maxAge"
                  type="text"
                  maxLength={3}
                  placeholder=""
                  {...register("patientAge.maxAge")}
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.value = target.value.replace(/[^0-9]/g, "0");
                  }}
                  className="p-1 w-[50px] text-center text-md border-2 border-gray-200 rounded-[7px]  focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent"
                />
              </div>
            </div>
            <div className="col-start-9 col-end-12 mt-10">
              <div className="flex items-center gap-2 text-white">
                <Checkbox
                  id="terms"
                  {...register("toShowProvider")}
                  // defaultChecked={toShowProvider}
                  checked={toShowProvider}
                  onCheckedChange={(checked: any) =>
                    setValue("toShowProvider", checked)
                  }
                  className="data-[state=checked]:bg-blue-700 border-[#55575a] data-[state=checked]:border-blue-700"
                />

                <Label
                  htmlFor="terms"
                  className="text-md text-gray-700 font-normal"
                >
                  Show Provider Options
                </Label>
              </div>
              <Typography as="p" className="text-sm text-gray-400">
                Turn on checkbox to show provider on patient form
              </Typography>
            </div>

            {/** description */}
            <div className=" col-span-11 mt-8 ">
              <Label
                htmlFor="description"
                className="block text-md mb-3 font-normal text-gray-700"
              >
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Please describe the reason"
                {...register("description")}
                className="p-3 pl-2 h-[120px] pr-2 text-md  border-2 border-gray-200 rounded-[7px] mt-2  focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent"
              />
              {/* {errors.description && (
                <span className="text-red-500 text-sm">
                  This field is required
                </span>
              )} */}
            </div>
            {/** Future Use */}
            <div className="flex justify-end gap-5  col-span-12 mt-10">
              {/*<div className="space-x-2 text-white">
              <Checkbox
                id="terms"
                {...register("autoSync")}
                className="data-[state=checked]:bg-blue-700 border-[#55575a] data-[state=checked]:border-blue-700"
              />

                <Label
                  htmlFor="terms"
                  className="text-md text-gray-700 font-normal"
                >
                  Don't auto sync
                </Label>
              </div> */}

              <div className="space-x-3">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    className="bg-[#eaeaec] text-gray-700 text-md font-normal hover:bg-[#eaeaec] px-9 rounded-[7px]"
                  >
                    Discard
                  </Button>
                </DialogClose>
                <Button
                  className="bg-[#6995fe] font-normal text-md text-white px-9 rounded-[7px] hover:bg-[#6995fe]"
                  type="submit"
                  disabled={
                    (!appointmentType?.id && !duration) ||
                    !operatories?.length ||
                    !providers?.length ||
                    !reasonName ||
                    isObjectValueChange
                  }
                >
                  Save
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddAndEditReasonForVisitData;
