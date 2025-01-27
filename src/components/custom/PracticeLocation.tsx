import * as React from "react";
import { useForm } from "react-hook-form";
import DynamicSelectDropDown from "./DynamicSelectDropDown";
import { useGetPracticeListQuery } from "@/redux/practiceDashBoard/apiSlice";
import { useDispatch } from "react-redux";
import { persistPracticeDetails } from "@/redux/practiceDashBoard/slice";

export default function SelectDemo() {
  const { control, watch } = useForm(); // Initialize useForm and extract control
  const { practiceLocation } = watch();
  const dispatch = useDispatch();
  const { data: practiceList = { result: [] } } =
    useGetPracticeListQuery<any>();
  const localStoragePracticeLocation: string | null =
    localStorage.getItem("practiceLocation") || null;

  const persistedPracticeLocation = React.useMemo(() => {
    if (!localStoragePracticeLocation) {
      return null;
    }

    try {
      const parsed = JSON.parse(localStoragePracticeLocation);
      return parsed ? parsed : null;
    } catch (error) {
      return null;
    }
  }, [localStoragePracticeLocation]);

  React.useEffect(() => {}, [practiceList]);

  React.useEffect(() => {
    if (
      practiceList?.result?.some(
        (item: any) => item.id === persistedPracticeLocation?.id
      )
    ) {
      dispatch(
        persistPracticeDetails(
          persistedPracticeLocation?.id ? persistedPracticeLocation : ""
        )
      );
    } else if (practiceList?.result?.length) {
      dispatch(
        persistPracticeDetails(
          practiceList?.result[0]?.id ? practiceList?.result[0] : ""
        )
      );
    }
  }, [practiceList]);

  React.useEffect(() => {
    if (practiceLocation?.id) {
      localStorage.removeItem("practiceLocation");
      practiceLocation?.id &&
        localStorage.setItem(
          "practiceLocation",
          JSON.stringify(practiceLocation)
        );
      dispatch(
        persistPracticeDetails(practiceLocation?.id ? practiceLocation : "")
      );
    }
  }, [practiceLocation]);

  return (
    <div>
      <DynamicSelectDropDown
        name="practiceLocation"
        control={control}
        options={practiceList?.result || []}
        selected={
          practiceLocation?.id
            ? practiceLocation
            : practiceList?.result?.some(
                (item: any) => item.id === persistedPracticeLocation?.id
              )
            ? persistedPracticeLocation
            : practiceList?.result[0]
        }
        classname={"w-[350px]"}
        footer={true}
      />
    </div>
  );
}
