import {
  useAddReferrerMutation,
  useDeleteReferrerMutation,
  useGetReferrerListQuery,
  useUpdateReferrerMutation,
} from "@/redux/practiceDashBoard/apiSlice";
import { useSelector } from "react-redux";
import ReferrerTable from "./ReferrerTable";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AddEditReferrer from "./AddEditReferrer";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import ConfirmationBox from "@/components/custom/ConfirmationBox";
import { RootState } from "@/redux/store";
import {
  AddEditReferrerPayloadType,
  getReferrerDetails,
  PracticeSettingsDetailsDataType,
} from "@/types/settings";
import SkeletonReferrerTable from "@/components/custom/skeletons/SkeletonReferrerTable";

type AppProps = {
  generalDetailsData: PracticeSettingsDetailsDataType;
};
const Referrer = ({ generalDetailsData }: AppProps) => {
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [openDeletePopup, setOpenDeletePopup] = useState<boolean>(false);
  const [dataToDelete, setDataToDelete] = useState<getReferrerDetails | null>(
    null
  );
  const [formType, setFormType] = useState("");
  const [formData, setFormData] = useState<getReferrerDetails | null>(null);
  const { watch, setValue, register, control } =
    useForm<AddEditReferrerPayloadType>({
      defaultValues: {
        referrerName: "",
        sourceType: { id: "", label: "" },
      },
    });

  const { sourceType, referrerName } = watch();
  const persistPracticeId = useSelector(
    (state: RootState) => state?.persisted?.practice?.persistPracticeDetails?.id
  );

  //Api Call
  const { data: reviewData, isFetching } = useGetReferrerListQuery(
    { practiceId: persistPracticeId },
    { skip: !persistPracticeId }
  );

  const [addReferrer] = useAddReferrerMutation();
  const [editReferrer] = useUpdateReferrerMutation();
  const [deleteReferrer] = useDeleteReferrerMutation();

  const togglePopup = () => {
    setOpenPopup(!openPopup);
  };

  const handleAddReferrer = async () => {
    togglePopup();
    try {
      const finalData = {
        practiceId: persistPracticeId,
        referrerName: referrerName,
        sourceType: sourceType?.id,
      };
      const result = await addReferrer(finalData).unwrap();
      if (result?.success) {
        toast.success(result?.message || "Added successfully!");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to Added");
    }
  };

  const handleEditReferrer = async () => {
    togglePopup();
    try {
      const finalData = {
        practiceId: persistPracticeId,
        referrerName: referrerName,
        sourceType: sourceType?.id,
        referrerId: formData?.id,
      };
      const result = await editReferrer(finalData).unwrap();
      if (result?.success) {
        toast.success(result?.message || "Updated successfully!");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update");
    }
  };

  // Delete Reason
  const handleDeleteReferrer = async () => {
    try {
      const result: any = await deleteReferrer({
        referrerId: dataToDelete?.id,
        practiceId: persistPracticeId,
      }).unwrap();
      if (result?.success) {
        toast?.success("Deleted successfully!");
      } else if (result?.success === 0) {
        toast?.error(result?.message);
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to Delete");
    } finally {
      setOpenDeletePopup(!openDeletePopup);
    }
  };

  const toggleDeleteConfirmationPopup = () => {
    setOpenDeletePopup(!openDeletePopup);
  };

  const handleDeleteGetData = (data: getReferrerDetails) => {
    setDataToDelete(data);
    toggleDeleteConfirmationPopup();
  };

  const getEditData = (data: getReferrerDetails) => {
    setFormType("Edit");
    setFormData(data);
    setValue("referrerName", data?.name);
    setValue("sourceType", { id: data?.source_type, label: data?.source_type });
    togglePopup();
  };

  return (
    <div className="w-full md:w-[55%] p-[5px]">
      <div className="text-end mt-5">
        <Button
          className="border bg-[#769FFD] hover:bg-[#769FFD] border-[#769FFD] rounded-[7px] min-w-[110px] min-h-12 text-[18px] items-center"
          onClick={() => {
            setFormType("Add");
            setFormData(null);
            setValue("referrerName", "");
            setValue("sourceType", { id: "", label: "" });
            togglePopup();
          }}
        >
          + Add
        </Button>
      </div>
      {isFetching? (
        <SkeletonReferrerTable />
      ) : reviewData?.result ? (
        <ReferrerTable
          tableData={reviewData?.result || []}
          getEditData={getEditData}
          handleDeleteGetData={handleDeleteGetData}
          formUrl={generalDetailsData?.form_url}
        />
      ) : (
        <div className="skeleton-loader h-[300px] w-full" />
      )}
      {openPopup && (
        <AddEditReferrer
          open={openPopup}
          onClose={togglePopup}
          watch={watch}
          register={register}
          control={control}
          handleSubmit={
            formType === "Add" ? handleAddReferrer : handleEditReferrer
          }
          formType={formType}
        />
      )}
      {openDeletePopup && (
        <ConfirmationBox
          isOpen={openDeletePopup}
          onClose={toggleDeleteConfirmationPopup}
          handleSubmit={handleDeleteReferrer}
          headingText="Delete referrer ?"
          acceptBtnText="Delete"
          declineBtnText="Cancel"
          detailsText="This action cannot be undone"
          maxWidth="max-w-[500px]"
        />
      )}
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

export default Referrer;
