import { useState } from "react";
import WidgetTop from "./WidgetTop";
import WidgetBottom from "./WidgetBottom";
import {
  useUpdateConversionTrackingMutation,
  useUpdateSchedulingLinkMutation,
} from "@/redux/practiceDashBoard/apiSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Widgets = ({ generalDetailsData }: any) => {
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const togglePopup = () => {
    setOpenPopup(!openPopup);
  };

  const [updateSchedulingLink] = useUpdateSchedulingLinkMutation();
  const [updateConversionTracking] = useUpdateConversionTrackingMutation();

  const handleSchedulingLink = async (data: any) => {
    try {
      const result: any = await updateSchedulingLink(data).unwrap();
      if (result?.success) {
        toast.success(" Updated successfully!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to Update");
    } finally {
      togglePopup();
    }
  };

  const handleConversionLink = async (data: any) => {
    try {
      const result: any = await updateConversionTracking(data).unwrap();
      if (result?.success) {
        toast.success(" Updated successfully!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to Update");
    } finally {
      togglePopup();
    }
  };
  return (
    <div id="widgets" className=" w-full ">
      <div className=" w-full md:w-[45%] p-[25px] ">
        <WidgetTop
          generalDetailsData={generalDetailsData}
          handleSchedulingLink={handleSchedulingLink}
        />
      </div>
      <hr className="border-t-2 border-dotted border-gray-300" />
      <div className="w-full md:w-[45%] p-[25px]">
        <WidgetBottom
          generalDetailsData={generalDetailsData}
          handleConversionLink={handleConversionLink}
        />
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

export default Widgets;
