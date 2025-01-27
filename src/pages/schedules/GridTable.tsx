import React from "react";
import { timeSlots } from "../../constant/timeSlots";
// import * as Tooltip from "@radix-ui/react-tooltip";
import { calculatePosition } from "../../utils/PositionCalculator";
// import { TooltipProvider } from "../ui/tooltip";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const Table = ({ scheduleData, blockoutData , appointmentList}) => {
  // generate list of all operators from schedule and blockout both (unique)
  const operatories = [
    ...new Set([
      // i am using here set because set object automatically removes duplicate values and the spread operator (...) is used to convert the Set back into an array because Set itself is not an array and cannot be directly iterated over as needed later in the code.
      ...scheduleData.map((item) => item.operatory),
      ...blockoutData.map((item) => item.operatory),
      ...appointmentList.map((item) => item.operatory)
    ]),
  ];

  // group schedule and blockout data by operator
  const groupedData = operatories.map((opr) => ({
    opr,
    schedule: scheduleData.filter((item) => item.operatory === opr),
    blockouts: blockoutData.filter((item) => item.operatory === opr),
    appointment: appointmentList.filter((items) => items.operatory === opr)
  }));

  console.log(appointmentList,"groupedData");
  

  return (
    <div className="flex flex-col px-4 bg-white">
      {/* Header */}
      <div className="flex ml-16 w-max">
        {groupedData.map((op) => (
          <div
            key={op.opr}
            className="text-center w-[352px] bg-red-200 border p-2 font-bold"
          >
            {op.opr}
          </div>
        ))}
      </div>

      {/* Schedule */}
      <div className="flex relative w-max">
        {/* Time Column */}
        <div className="w-16 flex flex-col bg-white">
          {timeSlots.map((time) => (
            <div
              key={time}
              className=" h-16 w-16 text-xs flex items-start justify-center border-b border-l border-t border-gray-300"
            >
              {time}
            </div>
          ))}
        </div>

        {/* Operatory Columns */}
        {groupedData.map(
          (
            op // op is operatory column
          ) => (
            <div key={op.opr} className="border-l border-gray-300 relative">
              {/* blank Slots for each operatory column*/}
              {timeSlots.map((time) => (
                <div
                  key={time}
                  className="h-16 border-b w-[352px] border-gray-300 bg-gray-100"
                ></div>
              ))}

              {/* schedule blocks */}
              {op.schedule.map((appt) => {
                const { top, height } = calculatePosition(
                  appt.startTime,
                  appt.endTime
                );
                return (
                  <>
                    <TooltipProvider delayDuration={0} skipDelayDuration={500}>
                      <Tooltip>
                        {/* Tooltip Trigger */}
                        <TooltipTrigger asChild>
                          <div
                            key={appt.title}
                            className="absolute mx-2 flex flex-col justify-end items-end left-0 right-0 bg-gray-400 bg-opacity-60 text-black border border-white shadow-md p-2 overflow-hidden"
                            style={{ top: `${top}px`, height: `${height}px` }}
                          >
                            <span className="text-sm font-semibold break-words">
                              {appt.provider}
                            </span>
                            <span className="text-sm font-semibold break-words">
                              {appt.title}
                            </span>
                          </div>
                        </TooltipTrigger>

                        {/* Tooltip content */}
                        {/* <Tooltip.Portal> */}
                          <TooltipContent
                            className="flex flex-col gap-3 bg-gray-800 text-white p-2 rounded-md max-w-[300px]"
                            sideOffset={5}
                          >
                            <span className="text-center font-bold">
                              Schedule
                            </span>
                            <span>Provider : {appt.provider}</span>
                            <span className="text-[10px] text-end">
                              {appt.startTime} to {appt.endTime}
                            </span>

                            {/* <Tooltip.Arrow className="fill-gray-800" /> */}
                          </TooltipContent>
                        {/* </Tooltip.Portal> */}
                      </Tooltip>
                    </TooltipProvider>
                  </>
                );
              })}

              {/* Blockout Blocks */}
              {op.blockouts.map((blockout) => {
                const { top, height } = calculatePosition(
                  blockout.startTime,
                  blockout.endTime
                );
                return (
                  <>
                    <TooltipProvider delayDuration={0} skipDelayDuration={500}>
                      <Tooltip>
                        {/* Tooltip Trigger */}
                        <TooltipTrigger asChild>
                          <div
                            key={blockout.title}
                            className="absolute flex flex-col justify-start mx-4 px-2 left-0 right-0 text-black text-start bg-transparent border-2 border-blue-400 rounded shadow-md overflow-hidden"
                            style={{ top: `${top}px`, height: `${height}px` }}
                          >
                            <span className="text-[12px] font-semibold break-words">
                              {blockout.title}
                            </span>
                          </div>
                        </TooltipTrigger>

                        {/* Tooltip content */}
                        {/* <Tooltip.Portal> */}
                          <TooltipContent
                            className="flex flex-col gap-3 bg-gray-800 text-white p-2 rounded-md max-w-[300px] "
                            sideOffset={5}
                          >
                            <span className="text-center font-bold">
                              Block out
                            </span>
                            <span>Blockout Type : {blockout.title}</span>
                            <span className="text-[10px] text-end">
                              {blockout.startTime} to {blockout.endTime}{" "}
                            </span>
                            {/* <Tooltip.Arrow className="fill-gray-800" /> */}
                          </TooltipContent>
                        {/* </Tooltip.Portal> */}
                      </Tooltip>
                    </TooltipProvider>
                  </>
                );
              })}

              {/* appointment blocks */}
              {op.appointment.map((apt) => {
                const { top, height } = calculatePosition(
                  apt.startTime,
                  apt.endTime
                );
                return (
                  <>
                    <TooltipProvider delayDuration={0} skipDelayDuration={500}>
                      <Tooltip>
                        {/* Tooltip Trigger */}
                        <TooltipTrigger asChild>
                          <div
                            key={apt.title}
                            className="absolute mx-2 flex flex-col justify-end items-end left-0 right-0 bg-blue-400  text-black border border-white shadow-md p-0.5 overflow-hidden"
                            style={{ top: `${top}px`, height: `${height}px` }}
                          >
                            <span className="text-sm font-semibold break-words">
                              {apt.patientName}
                            </span>
                            <span className="text-sm font-semibold break-words">
                              {apt.title}
                            </span>
                          </div>
                        </TooltipTrigger>

                        {/* Tooltip content */}
                        {/* <Tooltip.Portal> */}
                          <TooltipContent
                            className="flex flex-col gap-3 bg-gray-800 text-white p-2 rounded-md max-w-[300px]"
                            sideOffset={5}
                          >
                            <span className="text-center font-bold">
                              Appointment details
                            </span>
                            {/* <span>Provider : {apt.provider}</span> */}
                            <span>Patient name : {apt.patientName}</span>
                            <span> Attended by : {apt.providerName} </span>
                            <span> Reason for visit : {apt.reasonForVisit} </span>

                            <span className="text-[10px] text-end">
                              {apt.startTime} to {apt.endTime}
                            </span>

                            <div className="fill-gray-800" />
                          </TooltipContent>
                        {/* </Tooltip.Portal> */}
                      </Tooltip>
                    </TooltipProvider>
                  </>
                );
              })}

            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Table;
