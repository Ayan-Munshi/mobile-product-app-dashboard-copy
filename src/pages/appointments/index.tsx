import { useEffect, useState } from "react";
import AppointmentTable from "./AppointmentTable";
import { Typography } from "@/components/custom/Typography";
import {
  useAppointmentDeleteMutation,
  useGetAppointmentListQuery,
  useGetGeneralSettingDataQuery,
  useGetSingleAppointmentDetailsQuery,
  useSyncAppointmentAndPatientMutation,
  useSyncAppointmentMutation,
  useUpdateAptStatusMutation,
} from "@/redux/practiceDashBoard/apiSlice";
import { useSelector } from "react-redux";
import TableFilter from "./TableFilter";
import useDebounce from "@/customHooks/useDebounce";
import AppointmentDrawer from "./AppointmentDrawer";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast, ToastContainer } from "react-toastify";
import SkeletonAppointments from "@/components/custom/skeletons/SkeletonAppointments";
import {
  AppointmentDeleteResponseType,
  AppointmentFilterType,
  AppointmentListType,
} from "@/types/appointments";
import { RootState } from "@/redux/store";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

//*** Main return function

const Appointments = () => {
  const [filterState, setFilterState] = useState<AppointmentFilterType>({
    searchValue: "",
    scheduledStartDate: null,
    scheduledEndDate: null,
    apptTimeStartDate: null,
    apptTimeEndDate: null,
    provider: {
      value: "",
      label: "Select Provider",
    },
    reason: {
      value: "",
      label: "Select Reason",
    },
    status: {
      value: "",
      label: "Select Status",
    },
    isNewPatient: {
      value: null,
      label: "Select Patient Status",
    },
    aptBookingStatus: {
      value: "1",
      label: "Booked through app",
    },
  });
  const [activeTab, setActiveTab] = useState<string>("Appointments");
  // Initializes state for sorting appointments by a specific field and order (ascending or descending).
  const [sortState, setSortState] = useState({
    sortBy: "",
    sortByValue: "",
  });

  // State to store the selected appointment ID, initially set to null
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  // State to control the visibility of the appointment drawer, initially closed
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [offset, setOffset] = useState<number>(0);
  // Items per page
  const [limit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  // Calculate total pages
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.ceil(totalCount / limit);
  const persistPracticeId = useSelector(
    (state: RootState) => state?.persisted?.practice?.persistPracticeDetails?.id
  );

  const { data: generalDetailsData = {} } = useGetGeneralSettingDataQuery(
    {
      practiceId: persistPracticeId,
    },
    { skip: !persistPracticeId }
  );
  //Update appointmet status
  const [updateAptStatus] = useUpdateAptStatusMutation();
  //Sync appointmet
  const [syncAppointment] = useSyncAppointmentMutation();
  //Sync appointmet and patient
  const [
    syncAppointmentAndPatient,
    { isLoading: syncAptAndPatientLoading = false },
  ] = useSyncAppointmentAndPatientMutation();
  //Delete unsynced appointment
  const [appointmentDelete] = useAppointmentDeleteMutation();

  const { data: appointmentList = [], isFetching } = useGetAppointmentListQuery(
    {
      practiceId: persistPracticeId,
      // Conditionally change the query parameters based on the active tab and sync settings
      ...(activeTab === "approval-pending" &&
        generalDetailsData?.result?.auto_sync_appointment === false && {
          isAccepted: "0",
        }),
      ...filterState,
      ...sortState,
      offset,
      limit,
      bookedThroughUs: filterState?.aptBookingStatus?.value || null,
      searchValue: useDebounce(filterState?.searchValue, 500),
    },
    {
      skip: !persistPracticeId, // Skip the query if there is no persistPracticeId
    }
  );

  // Get Single Appointment Details
  const { data: getAppointmentDetails, isFetching: AppoitmentDetailsFetching } =
    useGetSingleAppointmentDetailsQuery(
      {
        practiceId: persistPracticeId,
        appointmentId,
      },
      {
        skip: !persistPracticeId || !appointmentId,
      }
    );

  // Resets the offset and current page to their initial values when the filter state changes.
  useEffect(() => {
    setOffset(0);
    setCurrentPage(1);
  }, [filterState]);

  // Updates the total count based on the appointment list whenever it changes for accurate pagination.
  useEffect(() => {
    if (appointmentList?.total_count) {
      setTotalCount(appointmentList?.total_count);
    } else {
      setTotalCount(0);
    }
  }, [appointmentList]);

  const handleSort = (name: string) => {
    setSortState((prev) => ({
      sortBy: name,
      sortByValue:
        prev.sortByValue === "asc"
          ? "desc"
          : prev.sortByValue === "desc"
          ? "asc"
          : "asc",
    }));
  };

  // Toggles the visibility of the appointment drawer.
  const toggleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Toggles the appointment drawer and sets the selected appointment ID when a table row is clicked.
  const getAppointmentTableData = (data: AppointmentListType) => {
    toggleDrawerOpen();
    setAppointmentId(data?.id);
  };

  // Handles appointment deletion and displays a toast message based on the response.
  const handleAppointmentDelete = async () => {
    try {
      const result: AppointmentDeleteResponseType = await appointmentDelete({
        practiceId: persistPracticeId,
        appointmentId: appointmentId,
      }).unwrap();

      if (result?.success) {
        toast.success("Appointment Deleted Successfully!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to Update");
    }
  };

  // Handlers for pagination
  const nextPage = () => {
    if (offset + limit < totalCount) {
      setOffset((prev) => prev + limit);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (offset > 0) {
      setOffset((prev) => prev - limit);
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    setOffset((page - 1) * limit);
    setCurrentPage(page);
  };

  const handleSyncAppointAndPatientData = async () => {
    try {
      const finalData = {
        practiceId: persistPracticeId,
      };

      const result = await syncAppointmentAndPatient(finalData).unwrap();

      if (result?.success) {
        toast.success("Synced successfully!");
      } else {
        toast.error("Failed to update");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update");
    }
  };

  const handleUpdateAptStatus = async (data: {
    aptId: string;
    status: string;
  }) => {
    setDrawerOpen(false);
    try {
      const finalData = {
        practiceId: persistPracticeId,
        status: data?.status,
        aptId: data?.aptId,
      };

      const result = await updateAptStatus(finalData).unwrap();

      if (result?.success) {
        toast.success(result?.message);
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update");
    }
  };

  // const handleDeleteApt = async (aptId: string) => {
  //   try {
  //     const finalData = {
  //       practiceId: persistPracticeId,
  //       aptId,
  //     };

  //     const result = await deleteApt(finalData).unwrap();

  //     if (result?.success) {
  //       toast.success("Synced successfully!");
  //     } else {
  //       toast.error("Failed to update");
  //     }
  //   } catch (error: any) {
  //     toast.error(error?.data?.message || "Failed to update");
  //   }
  // };

  // *** main return
  return (
    <div className="p-8 ">
      <div id="appointmet">
        <Typography as="div" className="flex justify-between items-center">
          <Typography
            as="h2"
            className="text-[#000000] font-medium text-[24px]"
          >
            Appointment List
          </Typography>
        </Typography>
      </div>

      <div id="Appointment-list" className="flex gap-6 mt-6">
        <div className="px-9 py-7 w-[100%] border rounded-[20px] bg-[#FFFF] ">
          <Tabs
            defaultValue="Appointments"
            onValueChange={setActiveTab}
            className="w-full "
          >
            {generalDetailsData?.result?.auto_sync_appointment === false ? (
              <div className="mb-5 border-b-2">
                <TabsList className=" gap-[40px h-11 bg-white text-gray-700 gap-10">
                  <TabsTrigger
                    value="Appointments"
                    className="relative text-[16px]  h-[42px]  data-[state=active]:after:content-[''] data-[state=active]:after:absolute  data-[state=active]:after:bottom-0 data-[state=active]:after:w-full data-[state=active]:after:h-[3px] data-[state=active]:after:bg-[#2260EE]  "
                  >
                    Appointments
                  </TabsTrigger>
                  <TabsTrigger
                    value="approval-pending"
                    className="relative text-[16px]  h-[42px]  data-[state=active]:after:content-[''] data-[state=active]:after:absolute  data-[state=active]:after:bottom-0 data-[state=active]:after:w-full data-[state=active]:after:h-[3px] data-[state=active]:after:bg-[#2260EE]"
                  >
                    Action Center
                  </TabsTrigger>
                </TabsList>
              </div>
            ) : (
              ""
            )}
            {activeTab === "Appointments" && (
              <TableFilter
                filterState={filterState}
                setFilterState={setFilterState}
                handleSyncAppointAndPatientData={
                  handleSyncAppointAndPatientData
                }
                syncAptAndPatientLoading={syncAptAndPatientLoading}
              />
            )}
            {isFetching ? (
              <SkeletonAppointments rows={10} />
            ) : (
              <div className="">
                <AppointmentTable
                tableRowClassName={"cursor-pointer"}
                tableData={appointmentList?.result || []}
                getAppointmentTableData={getAppointmentTableData}
                handleSort={handleSort}
                activeTab={activeTab}
                handleUpdateAptStatus={handleUpdateAptStatus}
                // handleDeleteApt={handleDeleteApt}
              />
              </div>
            )}
            <div className="flex justify-between mt-7 gap-5">
              {totalCount ? (
                <div className="w-full md:w-1/2 flex justify-center md:justify-start items-center">
                  <p>{`Showing ${offset + 1} to ${
                    offset + limit >= totalCount ? totalCount : offset + limit
                  } of ${totalCount} entries`}</p>
                </div>
              ) : (
                ""
              )}
              {activeTab === "Appointments" && totalCount ? (
                <Pagination className="mt-5 md:justify-end md:w-1/2 m-0 cursor-pointer">
                  <PaginationContent>
                    {/* Previous Button */}
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={currentPage > 1 ? previousPage : undefined}
                        className={
                          currentPage === 1 || totalCount === 0
                            ? "opacity-50 pointer-events-none"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {/* Page Numbers */}
                    {totalPages > 1 &&
                      [...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        const isEllipsisStart =
                          pageNumber === 2 && currentPage > 3;
                        const isEllipsisEnd =
                          pageNumber === totalPages - 1 &&
                          currentPage < totalPages - 2;

                        if (
                          pageNumber === 1 || // Always show the first page
                          pageNumber === totalPages || // Always show the last page
                          (pageNumber >= currentPage - 1 &&
                            pageNumber <= currentPage + 1) // Show one page before and after current
                        ) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                isActive={currentPage === pageNumber}
                                onClick={() => goToPage(pageNumber)}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        } else if (isEllipsisStart || isEllipsisEnd) {
                          return (
                            <PaginationItem key={`ellipsis-${pageNumber}`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null; // Don't render other page numbers
                      })}

                    {/* Next Button */}
                    <PaginationItem>
                      <PaginationNext
                        onClick={
                          currentPage < totalPages ? nextPage : undefined
                        }
                        className={
                          currentPage === totalPages || totalCount === 0
                            ? "opacity-50 pointer-events-none"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              ) : (
                ""
              )}
            </div>
          </Tabs>
        </div>
      </div>
      {drawerOpen && (
        <AppointmentDrawer
          syncAppointment={syncAppointment}
          isOpen={drawerOpen}
          onClose={toggleDrawerOpen}
          handleAppointmentDelete={handleAppointmentDelete}
          appointmentDetails={getAppointmentDetails?.result}
          AppoitmentDetailsFetching={AppoitmentDetailsFetching}
          activeTab={activeTab}
          handleUpdateAptStatus={handleUpdateAptStatus}
          // handleDeleteApt={handleDeleteApt}
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
    </div>
  );
};

export default Appointments;
