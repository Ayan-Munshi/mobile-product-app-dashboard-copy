import React, { useEffect, useState } from "react";
import Table from "./GridTable";
import { formatTime } from "../../utils/FormatTime";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  useGetAppointmentListQuery,
  useGetOperetoriesListQuery,
  useGetPracticeListQuery,
  useGetProvidersQuery,
  useGetScheduleListQuery,
} from "@/redux/practiceDashBoard/apiSlice";

const Schedules = () => {
  // Fetch practice list
  const { data: practiceList } = useGetPracticeListQuery();
  const [practiceId, setPracticeId] = useState(null);
  const [highlightConfigData, setHighlightConfigData] = useState([]);
  const [highlightBlockoutData, setHighlightBlockoutData] = useState([]);
  const [appointmentList, setappontmentList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Set initial practice ID when practiceList is available
  useEffect(() => {
    if (practiceList?.result?.length) {
      setPracticeId(practiceList.result[0].id);
    }
  }, [practiceList]);

  // Fetch operatory list
  const { data: operatoryList } = useGetOperetoriesListQuery({
    practiceId,
  });

  // Fetch appointment list
  const { data: appointmentData } = useGetAppointmentListQuery({
    practiceId: practiceId,
    apptTimeStartDate: selectedDate,
    apptTimeEndDate: selectedDate,
  });

  // Fetch schedule list
  const { data: scheduledSlots, isLoading } = useGetScheduleListQuery({
    practice_id: practiceId,
    date: selectedDate,
  });

  // Fetch provider list
  const { data: providerList } = useGetProvidersQuery({
    practiceId,
  });

  // Process scheduled data
  useEffect(() => {
    if (
      scheduledSlots?.result &&
      operatoryList?.result &&
      providerList?.result &&
      appointmentData?.result
    ) {
      // Process "Provider" slots
      const providerData = scheduledSlots.result.flatMap((slot) => {
        if (slot.schedule_type === "Provider" && slot.operatories) {
          const operatoriesArray = slot.operatories.split(",");
          return operatoriesArray.flatMap((op) => {
            const matchingOperatory = operatoryList?.result.find(
              (operatory) =>
                operatory?.pms_op_num.toString() === op.trim() &&
                !operatory?.is_hidden
            );

            const matchingProvider = providerList.result.find(
              (provider) =>
                provider?.pms_prov_num?.toString() === slot.prov_num?.toString()
            );

            if (matchingOperatory && matchingProvider) {
              return {
                startTime: formatTime(slot.start_time),
                endTime: formatTime(slot.stop_time),
                operatory: matchingOperatory.name,
                provider: `${matchingProvider.pms_first_name} ${matchingProvider.pms_last_name}`,
              };
            }
            return null;
          });
        }
        return null;
      });

      // Process "Blockout" slots
      const blockoutData = scheduledSlots?.result?.flatMap((slot) => {
        if (slot.schedule_type === "Blockout" && slot.operatories) {
          const operatoriesArray = slot.operatories.split(",");
          return operatoriesArray.flatMap((op) => {
            const matchingOperatory = operatoryList.result.find(
              (operatory) =>
                operatory.pms_op_num.toString() === op.trim() &&
                !operatory.is_hidden
            );

            if (matchingOperatory) {
              return {
                startTime: formatTime(slot.start_time),
                endTime: formatTime(slot.stop_time),
                operatory: matchingOperatory.name,
                title: slot?.blockout_type,
              };
            }
            return null;
          });
        }
        return null;
      });

      // appointment list data

      const appointmentListData = appointmentData?.result
        ?.flatMap((apt) => ({
          startTime: formatTime(apt?.start_time),
          endTime: formatTime(apt?.end_time),
          patientName: `${apt?.pat_first_name} ${apt?.pat_last_name}`,
          operatory: apt?.operatory_name,
          providerName: `${apt?.prov_first_name} ${apt?.prov_last_name}`,
          reasonForVisit: `${apt?.reason_for_visit}`
        }))
        .filter(
          (item, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.operatoryName === item.operatoryName &&
                t.startTime === item.startTime &&
                t.endTime === item.endTime
            )
        );

      // Update state with filtered data
      setHighlightConfigData(providerData.filter((item) => item !== null));
      setHighlightBlockoutData(blockoutData.filter((item) => item !== null));
      setappontmentList(appointmentListData || []);
    }
  }, [scheduledSlots, operatoryList, providerList, appointmentData]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  console.log(appointmentList, "bkbkb");

  return (
   
     <div className="p-4 max-w-[1400px] w-full">
      <p className="text-center text-xl">
        Showing Schedules for {selectedDate}
      </p>
      <div className="flex justify-between items-center bg-white py-2">
        <div className="text-lg font-bold flex flex-col gap-2">
          <p className="font-medium">Date</p>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="p-2 rounded bg-gray-100"
          />
        </div>
        <div className="flex flex-col items-center gap-2 bg-white">
          <p className="font-medium">Practice ID:</p>
          <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm min-w-[320px]">
            {practiceId || "Loading..."}
          </div>
        </div>
      </div>

      {isLoading ? (
        <Icon icon="codex:loader" width="50" height="50" color="blue" />
      ) : (
        <div className="overflow-x-auto">
          <Table
            scheduleData={highlightConfigData}
            blockoutData={highlightBlockoutData}
            appointmentList={appointmentList}
          />
        </div>
      )}
    </div>
  
  );
};

export default Schedules;
