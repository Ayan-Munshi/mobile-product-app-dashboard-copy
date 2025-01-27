import { useState } from "react";
import { ReasonForVisitTable } from "./ReasonForVisitTable";
import { Typography } from "@/components/custom/Typography";
import { Button } from "@/components/ui/button";
import {
  useUpdateReasonStatusMutation,
  useDeleteReasonForVisitMutation,
  useCreateReasonMutation,
  useUpdateReasonMutation,
  useLazyGetSingleReasonDetailsQuery,
  useGetReasonForVisitListQuery,
} from "@/redux/practiceDashBoard/apiSlice";
import { reasonForVisiTableHeaders } from "@/constant/tableheaders/reasonForVisit";
import AddAndEditReasonForVisitData from "./AddAndEditReasonForVisitData";
import ConfirmationBox from "@/components/custom/ConfirmationBox";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SkeletonReasonForVisitTable from "@/components/custom/skeletons/SkeletonReasonForVisitTable";

const ReasonForVisit = () => {
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [openDeletePopup, setOpenDeletePopup] = useState<boolean>(false);
  const [dataToDelete, setDataToDelete] = useState<any>(null);

  const [openConfirmationPopup, setOpenConfirmationPopup] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<any>(null);
  const [activeInactiveData, setactiveInactiveData] = useState<any>(null);
  // to update raeson status
  const [updateReasonStatus] = useUpdateReasonStatusMutation();
  // to delete a reason for visit
  const [deleteReasonForVisit] = useDeleteReasonForVisitMutation();

  // to add a reason for visit
  const [createReason] = useCreateReasonMutation();

  // to update reason for visit
  const [updateReason] = useUpdateReasonMutation();

  const persistPracticeId = useSelector((state: any) => {
    return state?.persisted?.practice?.persistPracticeDetails?.id;
  });

  // get reason for visit list
  const { data: reasonForVisitList = [], isFetching } =
    useGetReasonForVisitListQuery(
      { practiceId: persistPracticeId },
      { skip: !persistPracticeId }
    );

  const [getSingleReasonDetails, { isFetching: singleReasonFetching = false }] =
    useLazyGetSingleReasonDetailsQuery({
      refetchOnFocus: false, // Control refetching behavior at the hook level
    });

  // Open/close edit reason modal
  const togglePopup = () => {
    setOpenPopup(!openPopup);
  };
  // handle add reason
  const handleCreateReason = async (data: any) => {
    try {
      const result = await createReason(data).unwrap();
      if (result?.success) {
        toast.success("Reason Created successfully!");
      } else if (result?.success === 0) {
        toast?.error(result?.message);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to Create");
    } finally {
      togglePopup();
    }
  };

  // handle update reason
  const handleReasonUpdate = async (data: any) => {
    try {
      const result = await updateReason(data).unwrap();
      if (result?.success) {
        // setReasonForVisitId("")
        toast.success("Reason Updated successfully!");
      } else if (result?.success === 0) {
        toast?.error(result?.message);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to Update");
    } finally {
      togglePopup();
    }
  };

  // Delete Reason
  const handleDeleteReason = async () => {
    try {
      const result: any = await deleteReasonForVisit({
        reasonForVisitId: dataToDelete?.id,
        practiceId: persistPracticeId,
      }).unwrap();
      if (result?.success) {
        toast?.success("Deleted successfully!");
      } else if (result?.success === 0) {
        toast?.error(result?.message);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to Delete");
    } finally {
      setOpenDeletePopup(!openDeletePopup);
    }
  };

  //Update reason status
  const handleUpdatedReasonStatusData = () => {
    updateReasonStatus({
      activeReason: !activeInactiveData?.is_active,
      id: activeInactiveData?.id,
      practiceId: persistPracticeId,
    });
    setOpenConfirmationPopup(!openConfirmationPopup);
  };

  // Get reason edit id from table
  const getUpdatedData = async (data: any) => {
    try {
      togglePopup();
      const response = await getSingleReasonDetails({
        practiceId: persistPracticeId,
        id: data?.id,
      }).unwrap();
      setFormData({ ...response?.result });
    } catch (error) {}
  };

  // Open/close confirmation modal
  const toggleReasonStatusPopup = () => {
    setOpenConfirmationPopup(!openConfirmationPopup);
  };

  //Update state to the ROV being edited
  const handleToggleActiveStatus = (data: any) => {
    if (!data.is_active) {
      updateReasonStatus({
        activeReason: !data?.is_active,
        id: data?.id,
        practiceId: persistPracticeId,
      });
    } else {
      toggleReasonStatusPopup();
      setactiveInactiveData(data);
    }
  };
  const toggleDeleteConfirmationPopup = () => {
    setOpenDeletePopup(!openDeletePopup);
  };

  const handleDeleteGetData = (data: any) => {
    setDataToDelete(data);
    toggleDeleteConfirmationPopup();
  };

  return (
    <>
      <div id="reason-for-visit" className="p-10 flex items-start gap-6">
        <div id="table" className="w-[100%] border rounded-[20px] bg-[#FFFF]">
          <Typography
            as="div"
            className="flex justify-between py-4 px-6 items-center"
          >
            <Typography
              as="h2"
              className="text-[#000000] font-medium text-[24px]"
            >
              Reasons For Visit
            </Typography>
            <Button
              className="border bg-[#769FFD] hover:bg-[#769FFD] border-[#769FFD] rounded-[7px] min-w-[110px] min-h-12 text-[18px] items-center"
              onClick={() => {
                togglePopup();
                // setReasonForVisitId("");
                setFormData(null);
              }}
            >
              + Add
            </Button>
          </Typography>

          {isFetching ? (
            <SkeletonReasonForVisitTable />
          ) : (
            <ReasonForVisitTable
              tableHeaders={reasonForVisiTableHeaders}
              tableData={reasonForVisitList?.result}
              getUpdatedData={getUpdatedData}
              handleToggleActiveStatus={handleToggleActiveStatus}
              handleDeleteGetData={handleDeleteGetData}
            />
          )}
        </div>
        {/* overview */}
        {/*<div
          id="overview"
          // className="hidden sm:hidden md:block min-w-[30%] border rounded-[20px] overflow-hidden bg-[#FFFF]"
          className="hidden sm:hidden md:block min-w-[20%] border rounded-[20px] overflow-hidden bg-[#FFFF] opacity-0"
        >
          <Overview />
        </div>*/}
      </div>
      {openPopup && (
        <div
          style={{
            background: "#f0f0f0",
            padding: "10px",
            marginTop: "-1px",
            width: "100%",
          }}
        >
          <AddAndEditReasonForVisitData
            open={openPopup}
            onClose={togglePopup}
            type={formData ? "Edit" : "Add"}
            formData={formData}
            handleCreateReason={handleCreateReason}
            handleReasonUpdate={handleReasonUpdate}
            fetching={singleReasonFetching}
          />
        </div>
      )}
      {openConfirmationPopup && (
        <ConfirmationBox
          isOpen={openConfirmationPopup}
          onClose={toggleReasonStatusPopup}
          headingText="Deactivate reason for visit ?"
          detailsText=" If deactivated, the reason will no longer be visible to the patient however, all previous settings will remain unchanged."
          handleSubmit={handleUpdatedReasonStatusData}
          maxWidth="max-w-[560px]"
          acceptBtnText="Deactivate"
          declineBtnText="Cancel"
        />
      )}
      {openDeletePopup && (
        <ConfirmationBox
          isOpen={openDeletePopup}
          onClose={toggleDeleteConfirmationPopup}
          handleSubmit={handleDeleteReason}
          headingText="Delete reason for visit ?"
          acceptBtnText="Delete"
          declineBtnText="Cancel"
          detailsText="This action cannot be undone,if you would like to temporarily disable a reason, consider deactivating it."
          maxWidth="max-w-[500px]"
        />
      )}
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
    </>
  );
};

export default ReasonForVisit;
