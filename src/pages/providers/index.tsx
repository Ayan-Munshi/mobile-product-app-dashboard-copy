import { useEffect, useState } from "react";
import { Typography } from "@/components/custom/Typography";
import {
  useCreateReasonMutation,
  useGetProvidersQuery,
  useGetSingleProviderDetailsQuery,
  useUpdateProviderBlockoutDetailsMutation,
  useUpdateProviderDetailsMutation,
  useUpdateProviderStatusMutation,
} from "@/redux/practiceDashBoard/apiSlice";
import { providersTableHeaders } from "@/constant/tableheaders/providers";
import ProvidersTable from "./ProvidersTable";
import AddProviderRow from "./AddProviderRow";
import EditProvidersDetails from "./EditProvidersDetails";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import SkeletonProvidersTable from "@/components/custom/skeletons/SkeletonProvidersTable";

const Providers = () => {
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [formData, setFormData] = useState(null);
  const [providerAddPopup, setProviderAddPopup] = useState<boolean>(false);

  const persistPracticeId = useSelector(
    (state: any) => state?.persisted?.practice?.persistPracticeDetails?.id
  );
  const [providerList, setProviderList] = useState<any[]>([]);

  // Api Call
  const [
    updateProviderDetails,
    { error: updateProviderError = { message: "" } },
  ] = useUpdateProviderDetailsMutation();

  const [updateProviderBlockoutDetails] =
    useUpdateProviderBlockoutDetailsMutation();

  const { data: serverProviderList = {}, isFetching } = useGetProvidersQuery(
    {
      practiceId: persistPracticeId,
    },
    { skip: !persistPracticeId }
  );

  const [selectedProviders, setSelectedProviders] = useState<
    { id: string; name: string }[]
  >(
    serverProviderList?.result?.filter(
      (provider: any) => provider?.is_active === true
    ) || []
  );

  const [createReason] = useCreateReasonMutation();
  // update practice data by sync button
  // const [updatePracticeData, { isLoading: syncLoading }] =
  //   useUpdatePracticeDataMutation();
  const [singleProvidersParams, setSingleProvidersParams] = useState<any>(null);

  const {
    data: providerDetails = {},
    isFetching: singleProvidorFetching = false,
    error: singleProviderError = { message: "" },
  } = useGetSingleProviderDetailsQuery(singleProvidersParams, {
    skip: !singleProvidersParams,
  });

  const [updateProviderStatus] = useUpdateProviderStatusMutation();

  useEffect(() => {
    if (providerDetails?.result) {
      setFormData({ ...providerDetails?.result });
    }
  }, [providerDetails?.result, isFetching]);

  useEffect(() => {
    if (singleProviderError?.message || updateProviderError?.message) {
      setFormData(null);
    }
  }, [singleProviderError, updateProviderError]);

  useEffect(() => {
    setSelectedProviders(
      providerList?.filter((provider: any) => provider?.is_active)
    );
  }, [providerAddPopup]);

  useEffect(() => {
    if (serverProviderList?.result) {
      const providerData = serverProviderList?.result?.map((provider: any) => {
        return {
          name: `${provider?.pms_first_name} ${provider?.pms_last_name}`,
          id: provider?.id,
          ...provider,
        };
      });
      setSelectedProviders(
        serverProviderList?.result?.filter(
          (provider: any) => provider?.is_active === true
        )
      );
      setProviderList(providerData);
    }
  }, [serverProviderList?.result]);

  const togglePopup = () => {
    setOpenPopup(!openPopup);
  };

  const handleAddReason = (data: any) => {
    createReason({
      name: data?.reasonName,
      status:
        data?.patientStatus?.length === 2 ? "Both" : data?.patientStatus[0],
      providers: `${data?.providers?.length} selected`,
      Operatories: `${data?.operatories?.length} selected`,
      Active: data?.activeReason,
      Action: "",
    });
  };

  const handleProviderAdd = async () => {
    try {
      const filterProviderData = providerList.map((provider) => ({
        id: provider?.id,
        is_active: selectedProviders.some((p) => p.id === provider.id),
      }));

      updateProviderStatus({
        practiceId: persistPracticeId,
        providerData: filterProviderData,
      });
      const result = await updateProviderStatus({
        practiceId: persistPracticeId,
        providerData: filterProviderData,
      }).unwrap();
      if (result?.success) {
        toast.success("Provider list updated!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to Update");
    } finally {
      setProviderAddPopup((prev: boolean) => !prev);
    }
  };

  const handleCheckUncheckProviderToast = () => {
    toast.error("Provider mapped with reason for visit");
  };

  const handleProviderUpdate = async (formData: any) => {
    try {
      const result:any = await updateProviderDetails(formData).unwrap();
      if (result?.success) {
        toast.success("Provider Update Successfully!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to Update");
    } finally {
      togglePopup();
    }
  };

  const handleProviderBlockoutUpdate = async (formData: any) => {
    try {
      const result:any = await updateProviderBlockoutDetails(formData).unwrap();
      if (result?.success) {
        toast.success(
          result?.message || "Provider Blockout Update Successfully!"
        );
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to Update");
    } finally {
      togglePopup();
    }
  };

  const getUpdatedData = (data: any) => {
    togglePopup();
    const finalData = {
      providorId: data?.id,
      practiceId: persistPracticeId,
    };
    setSingleProvidersParams(finalData);
  };

  // const handleSyncData = async () => {
  //   try {
  //     const finalData = {
  //       practiceId: persistPracticeId,
  //     };

  //     const result = await updatePracticeData(finalData).unwrap();

  //     if (result?.success) {
  //       toast.success("Synced successfully!");
  //     } else {
  //       toast.error("Failed to update");
  //     }
  //   } catch (error: any) {
  //     toast.error(error?.data?.message || "Failed to update");
  //   }
  // };

  return (
    <>
      <div id="provider" className="p-10 flex gap-6">
        <div id="table" className="w-[100%] border rounded-[20px] bg-[#FFFF]">
          <Typography
            as="div"
            className="flex justify-between py-4 px-6 items-center"
          >
            <Typography as="h2" className="text-black font-medium text-[24px]">
              Providers
            </Typography>
            <div className="flex gap-4">
              {/* <button
                className="flex items-center justify-center gap-1 border-[1px] border-[#769FFD] py-2 px-1 rounded-[7px] h-[49px] w-[109px] bg-[#769FFD] text-white"
                onClick={handleSyncData}
              >
                <Icon
                  icon="uil:sync"
                  className={`h-4 w-3.5 text-white mt-0.5 shrink-0 ${
                    syncLoading
                      ? "animate-[spin_1s_linear_infinite_reverse]"
                      : ""
                  }`}
                />
                {syncLoading ? "Syncing" : "Sync"}
              </button> */}
              {isFetching ? (
                <div className="flex items-center px-2 h-[52px] border-[1px] border-gray-400 rounded-[7px] min-w-[200px]">
                  <Skeleton height={15} width={100} />
                </div>
              ) : (
                <AddProviderRow
                  selectedProviders={selectedProviders}
                  setSelectedProviders={setSelectedProviders}
                  options={providerList}
                  handleProviderAdd={handleProviderAdd}
                  handleCheckUncheckProviderToast={
                    handleCheckUncheckProviderToast
                  }
                  isOpen={providerAddPopup}
                  setIsOpen={setProviderAddPopup}
                />
              )}
            </div>
          </Typography>

          <div>
            {isFetching ? (
              <SkeletonProvidersTable />
            ) : (
              <ProvidersTable
                tableData={providerList?.filter(
                  (provider: any) => provider?.is_active
                )}
                tableHeaders={providersTableHeaders}
                getUpdatedData={getUpdatedData}
              />
            )}
          </div>
        </div>
      </div>
      {!isFetching && openPopup && (
        <div
          style={{
            background: "#f0f0f0",
            padding: "100px",
            marginTop: "-1px",
            width: "100%",
          }}
        >
          <EditProvidersDetails
            open={openPopup}
            onClose={togglePopup}
            type={formData ? "Edit" : "add"}
            handleAddReason={handleAddReason}
            handleProviderUpdate={handleProviderUpdate}
            handleProviderBlockoutUpdate={handleProviderBlockoutUpdate}
            formData={formData}
            fetching={singleProvidorFetching}
          />
        </div>
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

export default Providers;
