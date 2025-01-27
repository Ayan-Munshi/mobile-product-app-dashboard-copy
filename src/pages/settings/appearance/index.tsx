import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AppearanceFormDetails from "./AppearanceFormDetails";
import AppearancePreview from "./AppearancePreview";
import { useUpdateGeneralSettingDataMutation } from "@/redux/practiceDashBoard/apiSlice";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import _ from "lodash";
import { RootState } from "@/redux/store";
import { PracticeSettingsDetailsDataType } from "@/types/settings";

type AppProps = {
  generalDetailsData: PracticeSettingsDetailsDataType;
  isFetching:boolean;
};

const Appearance = ({ generalDetailsData, isFetching }: AppProps) => {
  const [openPopup, setOpenPopup] = useState<boolean>(false);

  const persistPracticeId = useSelector(
    (state: RootState) => state?.persisted?.practice?.persistPracticeDetails?.id
  );

  const togglePopup = () => {
    setOpenPopup(!openPopup);
  };

  //update api
  const [updateGeneralSettingData] = useUpdateGeneralSettingDataMutation();

  const [filteredResponse, setfilteredResponse] = useState({});
  const { register, watch, setValue } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      details: "",
      logo: "",
      file: null,
      brandColor: "#144092",
      colorPrimary: "#144092",
      colorSecondary: "#144092",
    },
  });

  const [objcompare, setObjcompare] = useState(Boolean); // this will give true and false by comparing new and old data
  // to continuously montitering the change

  const watchedValue = watch();

  useEffect(() => {
    const isEqual = _.isEqual(filteredResponse, watchedValue); // Deep comparison
    setObjcompare(isEqual);
  }, [watchedValue, filteredResponse, objcompare]);

  useEffect(() => {
    if (generalDetailsData) {
      setValue("name", generalDetailsData?.name);
      setValue("phone", generalDetailsData?.phone);
      setValue("address", generalDetailsData?.display_address);
      setValue("details", generalDetailsData?.description);
      setValue("logo", generalDetailsData?.logo);
      setValue(
        "brandColor",
        generalDetailsData?.form_customization?.brand_color
      );
      setValue(
        "colorPrimary",
        generalDetailsData?.form_customization?.button_color_1
      );
      setValue(
        "colorSecondary",
        generalDetailsData?.form_customization?.button_color_2
      );
    }
    setfilteredResponse({
      name: generalDetailsData?.name,
      phone: generalDetailsData?.phone,
      address: generalDetailsData?.display_address,
      details: generalDetailsData?.description,
      logo: generalDetailsData?.logo,
      brandColor: generalDetailsData?.form_customization?.brand_color,
      colorPrimary:
        generalDetailsData?.form_customization?.button_color_1,
      colorSecondary:
        generalDetailsData?.form_customization?.button_color_2,
      file: null,
    });
  }, [generalDetailsData]); // dont put only generalDetailsData in dependancy array else it will go into an infinite loop (if the api is off)

  const handleUpdateGeneralSetting = async () => {
    try {
      const result = await updateGeneralSettingData({
        ...watchedValue,
        practiceId: persistPracticeId,
      }).unwrap();
      if (result?.success) {
        toast.success("Settings Updated Successfully!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to Update");
    } finally {
      togglePopup();
    }
  };

  return (
    <div id="appearance" className="grid xl:grid-cols-2 grid-cols-1 ">
      {/* Left Side - Form */}
      <div className=" p-[25px] ">
        {/* <FileUploadForm/> */}
        <AppearanceFormDetails
          register={register}
          watch={watch}
          setValue={setValue}
          objcompare={objcompare}
          handleUpdateGeneralSetting={handleUpdateGeneralSetting}
          isFetching={isFetching}
        />
      </div>

      {/* Right Side - Sticky Preview */}
      <div className="h-[650px] mx-auto mt-28  sticky top-[90px] hidden xl:grid  ">
        <AppearancePreview watch={watch} isFetching={isFetching} />
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
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

export default Appearance;
