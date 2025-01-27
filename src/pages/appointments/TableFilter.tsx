import DateRangePicker from "@/components/custom/DateRangePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { appointmentStatusOption } from "@/constant/practiceStatus";
import {
  useGetProvidersQuery,
  useGetReasonForVisitListQuery,
} from "@/redux/practiceDashBoard/apiSlice";
import { Icon } from "@iconify/react/dist/iconify.js";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import { twMerge } from "tailwind-merge";
import { AnimatePresence } from "framer-motion";
import { RootState } from "@/redux/store";
import { CSSObject } from "@emotion/react";
import {
  AppointmentFilterType,
  ReasonForVisitItemType,
} from "@/types/appointments";

const patientStatusOption = [
  { value: "1", label: "New" },
  { value: "0", label: "Returning" },
];
const appointmentBookingStatusOption = [
  {
    label: "Both",
    value: null,
  },
  {
    label: "Booked through others",
    value: "0",
  },
  {
    label: "Booked through app",
    value: "1",
  },
];

type AppProps = {
  filterState: AppointmentFilterType;
  syncAptAndPatientLoading: boolean;
  handleSyncAppointAndPatientData: () => void;
  setFilterState: React.Dispatch<React.SetStateAction<AppointmentFilterType>>;
};

//*** Main return function

const TableFilter = ({
  filterState,
  setFilterState,
  syncAptAndPatientLoading,
  handleSyncAppointAndPatientData,
}: AppProps) => {
  // State for storing the start date of the scheduled event or appointment
  const [scheduledStartDate, setScheduledStartDate] = useState<Date | null>(
    null
  );
  // State for storing the end date of the scheduled event or appointment
  const [scheduledEndDate, setScheduledEndDate] = useState<Date | null>(null);
  // State for storing the start time of the appointment
  const [apptTimeStartDate, setApptTimeStartDate] = useState<Date | null>(null);
  // State for storing the End time of the appointment
  const [apptTimeEndDate, setApptTimeEndDate] = useState<Date | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // get reason for visit list
  const persistPracticeId = useSelector(
    (state: RootState) => state?.persisted?.practice?.persistPracticeDetails?.id
  );
  const { data: reasonForVisitList = [] } = useGetReasonForVisitListQuery(
    { practiceId: persistPracticeId },
    { skip: !persistPracticeId }
  );
  const { data: providerList } = useGetProvidersQuery(
    {
      practiceId: persistPracticeId,
    },
    { skip: !persistPracticeId }
  );

  // Filters the data based on the specified date range.
  useEffect(() => {
    if (
      scheduledStartDate ||
      scheduledEndDate ||
      apptTimeStartDate ||
      apptTimeEndDate
    ) {
      setFilterState((prev: AppointmentFilterType) => ({
        ...prev,
        scheduledStartDate: scheduledStartDate
          ? moment(scheduledStartDate).format("YYYY-MM-DD")
          : null,
        scheduledEndDate: scheduledEndDate
          ? moment(scheduledEndDate).format("YYYY-MM-DD")
          : null,
        apptTimeStartDate: apptTimeStartDate
          ? moment(apptTimeStartDate).format("YYYY-MM-DD")
          : null,
        apptTimeEndDate: apptTimeEndDate
          ? moment(apptTimeEndDate).format("YYYY-MM-DD")
          : null,
      }));
    }
  }, [
    scheduledStartDate,
    scheduledEndDate,
    apptTimeStartDate,
    apptTimeEndDate,
  ]);

  // Generates a list of options for the "Reason for Visit" dropdown from the provided data.
  const reasonForVisitOption = useMemo(() => {
    return reasonForVisitList?.result?.map((item: ReasonForVisitItemType) => ({
      value: item?.id,
      label: item?.name,
    }));
  }, [reasonForVisitList]);

  // Generates a modified list of providers based on the provided data.
  const providerOption = useMemo(() => {
    return providerList?.result?.map((item: ReasonForVisitItemType) => ({
      value: item?.id,
      label: `${item?.pms_first_name} ${item?.pms_last_name}`,
    }));
  }, [providerList]);

  // Handles changes to the filter values and updates the filter state with the new value for the specified filter name.
  const handleFilterValueChange = (
    value: string | null | { value: string | null; label: string },
    name: string
  ) => {
    setFilterState((prev: AppointmentFilterType) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Resets filter state and clears search and date values.
  const resetFilterData = () => {
    setFilterState({
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
    setScheduledStartDate(null);
    setScheduledEndDate(null);
    setApptTimeStartDate(null);
    setApptTimeEndDate(null);
  };

  // React-select styles
  const customStyles = {
    control: (base: CSSObject) => ({
      ...base,
      width: "100%",
      borderWidth: "1px",
      borderColor: "#f4f4f4",
      boxShadow: "none",
      backgroundColor: "#f4f4f4",
      color: "#948585",
      height: "100% !important",
      minHeight: "unset",
    }),
    singleValue: (base: CSSObject) => ({
      ...base,
      color: "#948585",
    }),

    placeholder: (base: CSSObject) => ({
      ...base,
      color: "#948585",
    }),

    option: (base: CSSObject) => ({
      ...base,
      backgroundColor: "#ffffff",
      color: "#374151",
      "&:hover": {
        backgroundColor: "rgb(243 244 246)",
        color: "#374151",
      },
    }),
  };

  const meaningfulValuesCount = Object.values(filterState).filter((value) => {
    if (value && typeof value !== "object") {
      // For non-object values, we check if they are non-empty strings
      return typeof value === "string" && value?.trim() !== "";
    }

    // For objects, handle additional logic for 'label' and 'value'
    if (typeof value === "object" && value !== null) {
      const obj = value as {
        value: string | null;
        label: string;
      };

      if (obj.label === "Booked through app") {
        // If label is "Booked through app", do not count this object
        return false;
      } else if (obj.label === "Both") {
        // If label is "Both" and value is null, increase the count
        return true;
      } else {
        obj.value !== null;
      }

      // For other cases, check the usual conditions
      return typeof obj?.value === "string" && obj?.value?.trim() !== "";
    }

    return false;
  }).length;

  // Toggles the visibility state between true and false.
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // *** main return
  return (
    <div>
      <div className="flex gap-4 justify-between">
        <div className="relative basis-[300px] border border-[#e1e1e1] bg-[#f4f4f4] text-base rounded-[7px] h-auto ">
          <Input
            className="h-full rounded-[7px] bg-[#f4f4f4]  pl-7 border-none focus-visible:ring-1 focus-visible:ring-blue-300 focus-visible:ring-offset-0 hover:ring-gray-400" // Add padding-left to make space for the icon
            value={filterState?.searchValue}
            onChange={(e) =>
              handleFilterValueChange(e.target.value, "searchValue")
            }
            placeholder="Search by patient name"
          />
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="!w-4 !h-5"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="m17 17l4 4M3 11a8 8 0 1 0 16 0a8 8 0 0 0-16 0"
              />
            </svg>
          </div>
        </div>

        <div className="flex gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className={twMerge(
                    "cursor-pointer text-white items-center w-[45px] h-[45px]",
                    isVisible
                      ? "hover:bg-[#6b93ff] rounded-full bg-[#729af4]"
                      : "hover:bg-[#f4f4f4] rounded-full bg-[#f4f4f4] text-[#737373] border"
                  )}
                  onClick={toggleVisibility}
                >
                  <Icon width={30} icon="mdi:filter-outline" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-base font-normal bg-gray-600 text-white">
                Filter
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className={twMerge(
                    "cursor-pointer text-white items-center w-[45px] h-[45px] hover:bg-[#6b93ff] rounded-full",
                    meaningfulValuesCount
                      ? "bg-[#6b93ff]"
                      : "bg-[#f4f4f4] hover:bg-[#f4f4f4] text-[#737373] border"
                  )}
                  onClick={resetFilterData}
                >
                  <Icon width={22} icon="carbon:reset" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-base font-normal bg-gray-600 text-white">
                Reset
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <AnimatePresence>
        {isVisible && (
          <>
            <div className="flex mt-6 gap-4 h-[50px] z-[10]">
              <Popover>
                <PopoverTrigger className="basis-[200px] flex-grow rounded-sm bg-[#f4f4f4] truncate">
                  {scheduledStartDate ? (
                    <div className="flex items-center justify-start gap-2 px-4 text-[#948585]">
                      <Icon icon="iconamoon:clock-light" />
                      <span className="">
                        {scheduledStartDate
                          ? moment(scheduledStartDate).format("YY-MM-DD")
                          : ""}
                      </span>
                      <span>-</span>
                      <span className="truncate overflow-hidden whitespace-nowrap">
                        {scheduledEndDate
                          ? `${moment(scheduledEndDate).format("YY-MM-DD")}`
                          : ""}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2 px-4 text-[#948585]">
                      <div className="flex items-center gap-1">
                        <Icon icon="iconamoon:clock-light" />
                        <span>Date Scheduled</span>
                      </div>
                      <Icon icon="mingcute:down-line" />
                    </div>
                  )}
                </PopoverTrigger>
                <PopoverContent className="max-w-[608px] w-[100%]">
                  <div className="flex justify-around text-[14px] text-gray-700 p-3">
                    <div>
                      <p>
                        Start Date:
                        <span>
                          {" "}
                          {scheduledStartDate
                            ? moment(scheduledStartDate).format("YYYY-MM-DD")
                            : ""}
                        </span>
                      </p>
                    </div>
                    <div className="ml-5">
                      <p>
                        End Date:
                        <span>
                          {scheduledEndDate
                            ? ` ${moment(scheduledEndDate).format(
                                "YYYY-MM-DD"
                              )}`
                            : ""}
                        </span>
                      </p>
                    </div>
                  </div>
                  <DateRangePicker
                    startDate={scheduledStartDate}
                    endDate={scheduledEndDate}
                    setStartDate={setScheduledStartDate}
                    setEndDate={setScheduledEndDate}
                    disabledEndDate={true}
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger className="basis-[200px] flex-grow rounded-sm bg-[#f4f4f4] truncate">
                  {apptTimeStartDate ? (
                    <div className="flex items-center justify-between gap-2 px-4 text-[#948585]">
                      <Icon icon="iconamoon:clock-light" />
                      <span className="">
                        {apptTimeStartDate
                          ? moment(apptTimeStartDate).format("YY-MM-DD")
                          : ""}
                      </span>
                      <span>-</span>
                      <span className="truncate overflow-hidden whitespace-nowrap max-w-full">
                        {apptTimeEndDate
                          ? `${moment(apptTimeEndDate).format("YY-MM-DD")}`
                          : ""}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2 px-4 text-[#948585]">
                      <div className="flex items-center gap-1">
                        <Icon icon="iconamoon:clock-light" />
                        <span>Appt. Time</span>
                      </div>
                      <Icon icon="mingcute:down-line" />
                    </div>
                  )}
                </PopoverTrigger>
                <PopoverContent className="max-w-[608px] w-[100%]">
                  <div className="flex justify-around text-[14px] text-gray-700 p-3">
                    <div>
                      <p>
                        Start Date:
                        <span>
                          {apptTimeStartDate
                            ? moment(apptTimeStartDate).format("YYYY-MM-DD")
                            : ""}
                        </span>
                      </p>
                    </div>
                    <div className="ml-5">
                      <p>
                        End Date:
                        <span>
                          {apptTimeEndDate
                            ? ` ${moment(apptTimeEndDate).format("YYYY-MM-DD")}`
                            : ""}
                        </span>
                      </p>
                    </div>
                  </div>
                  <DateRangePicker
                    startDate={apptTimeStartDate}
                    endDate={apptTimeEndDate}
                    setStartDate={setApptTimeStartDate}
                    setEndDate={setApptTimeEndDate}
                  />
                </PopoverContent>
              </Popover>
              <div className="basis-[200px] flex-grow rounded-sm">
                <Select
                  name="reason"
                  options={reasonForVisitOption}
                  onChange={(e) => handleFilterValueChange(e, "reason")}
                  value={filterState?.reason}
                  styles={customStyles}
                  className="h-[100%]"
                />
              </div>
              <div className="basis-[200px] flex-grow">
                <Select
                  name="provider"
                  options={providerOption}
                  onChange={(e) => handleFilterValueChange(e, "provider")}
                  value={filterState?.provider}
                  styles={customStyles}
                  className="h-[100%]"
                />
              </div>
              <div className="basis-[200px] flex-grow">
                <Select
                  name="isNewPatient"
                  options={patientStatusOption}
                  onChange={(e) => handleFilterValueChange(e, "isNewPatient")}
                  value={filterState?.isNewPatient}
                  styles={customStyles}
                  className="h-[100%]"
                  placeholder="Select Patient Status"
                />
              </div>

              <div className="basis-[200px] flex-grow ">
                <Select
                  name="status"
                  options={appointmentStatusOption}
                  onChange={(e) => handleFilterValueChange(e, "status")}
                  defaultValue={null}
                  value={filterState?.status || null}
                  placeholder="Status"
                  styles={customStyles}
                  className="h-[100%]"
                />
              </div>
            </div>
            <div className="flex mt-6 justify-items-end gap-4 h-[50px] z-[10]">
              <div className="basis-[245px]">
                <Select
                  name="aptBookingStatus"
                  options={appointmentBookingStatusOption}
                  onChange={(e) =>
                    handleFilterValueChange(e, "aptBookingStatus")
                  }
                  // defaultValue={null}
                  value={filterState?.aptBookingStatus || null}
                  styles={customStyles}
                  className="h-[100%]"
                />
              </div>
              <button
                className="flex items-center gap-1 border-[1px] border-[#769FFD] py-2 px-1 rounded-md min-w-[260px] justify-center bg-[#769FFD] text-white"
                onClick={handleSyncAppointAndPatientData}
              >
                <Icon
                  icon="uil:sync"
                  className={`h-4 w-3.5 text-white mt-0.5 shrink-0 ${
                    syncAptAndPatientLoading
                      ? "animate-[spin_1s_linear_infinite_reverse]"
                      : ""
                  }`}
                />
                {syncAptAndPatientLoading
                  ? "Syncing"
                  : "Sync Unsynced Appointment"}
              </button>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TableFilter;
