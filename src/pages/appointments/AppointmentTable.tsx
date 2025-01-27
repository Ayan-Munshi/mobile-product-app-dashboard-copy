import { DataTable } from "@/components/custom/DataTable";
import UserProfile from "@/components/custom/UserProfile";
import { cn } from "@/lib/utils";
import {
  AppointmentListType,
  appointmentTableHeadersType,
} from "@/types/appointments";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";

type AppProps = {
  tableData: AppointmentListType[];
  className?: string;
  getAppointmentTableData?: (data: AppointmentListType) => void;
  handleSort?: (data: string) => void;
  handleUpdateAptStatus?: (data: {aptId: string,status:string}) => void;
  // handleDeleteApt?: (data: string) => void;
  tableRowClassName?: string;
  activeTab?: string;
  type?: string;
};

//This function returns a background and text color based on the provided status by mapping it to predefined styles.
const statusClass = (status: string) => {
  const statusMap = {
    Confirmed: { bgColor: "#9BECC873", color: "#054025" },
    Unsynced: { bgColor: "#E5E5E5", color: "#514C09" },
    Cancelled: { bgColor: "#e6d6d6", color: "#800000ad" },
    Broken: { bgColor: "#ffe1e1", color: "#800000ad" },
    Deleted: { bgColor: "#E0E0E0", color: "#B22222" },
    Complete: { bgColor: "#9BECC873", color: "#054025" },
    Unconfirmed: { bgColor: "#ECE99B73", color: "#808000" },
  };

  // Return bgColor and color for the given status, or defaults if not found
  return (
    statusMap[status as keyof typeof statusMap] || {
      bgColor: "#FFFF", // Default background color
      color: "#000000", // Default text color
    }
  );
};

//*** Main return function
const AppointmentTable = ({
  tableData,
  getAppointmentTableData,
  handleSort,
  tableRowClassName,
  className,
  activeTab,
  handleUpdateAptStatus,
  // handleDeleteApt,
  type,
}: AppProps) => {
  // Define column structure
  const columns: ColumnDef<appointmentTableHeadersType, any>[] = [
    {
      accessorKey: "schedule",
      header: () => (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleSort?.("dateSchedule")}
        >
          <p>Date Scheduled</p>
          {handleSort && <Icon icon="ix:sort" />}
        </div>
      ),
    },
    { accessorKey: "newReturning", header: "New/Returning" },
    { accessorKey: "provider", header: "Provider" },
    {
      accessorKey: "patient",
      header: "Patient",
      cell: ({ getValue }) => {
        const value = getValue();
        return (
          <UserProfile
            firstName={value?.firstName}
            lastName={value?.lastName}
            profilePic={value?.profilePic}
            size="40"
            fontSize={2.5}
          />
        );
      },
    },
    { accessorKey: "reason", header: "Reason" },
    {
      accessorKey: "aptTime",
      header: () => (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleSort?.("apptTime")}
        >
          <p>Appt Time</p>
          {handleSort && <Icon icon="ix:sort" />}
        </div>
      ),
      cell: ({ getValue }) => {
        const value = getValue() || "--/--";
        return (
          <div className="flex gap-2 items-center">
            <p>{value?.date}</p>
            {value?.time ? (
              <div className="bg-[#ededed] text-[#727272] py-[3px] px-[7px] rounded-sm text-[14px] border border-[#bfbfbf]">
                {moment(value?.time, "HH:mm:ss").format("hh:mm A")}
              </div>
            ) : (
              "--/--"
            )}
          </div>
        );
      },
    },
    ...(activeTab === "Appointments"||type==="dashboard"
      ? [
          {
            accessorKey: "status",
            header: "Status",
            cell: ({ getValue }: { getValue: () => any }) => {
              const value = getValue();
              const { bgColor, color } = statusClass(value); // Get status colors
              // Otherwise, render the full status UI with icons
              return (
                <div
                  className="flex items-center justify-center font-medium py-[7px] rounded-sm gap-1 max-w-max px-[10px] text-[14px]"
                  style={{
                    backgroundColor: bgColor,
                    color: color,
                  }}
                >
                  {value === "Confirmed" && (
                    <Icon
                      icon="subway:tick"
                      fontSize={12}
                      style={{ color: color }}
                    />
                  )}
                  {value === "Unsynced" && (
                    <Icon
                      icon="mdi:sync-alert"
                      fontSize={17}
                      style={{ color: color }}
                    />
                  )}
                  {value === "Complete" && (
                    <Icon
                      icon="charm:circle-tick"
                      fontSize={17}
                      style={{ color: color }}
                    />
                  )}
                  {value === "Deleted" && (
                    <Icon
                      icon="mi:delete"
                      fontSize={17}
                      style={{ color: color }}
                    />
                  )}
                  {value === "Cancelled" && (
                    <Icon
                      icon="mdi:cancel"
                      fontSize={17}
                      style={{ color: color }}
                    />
                  )}
                  {value === "Broken" && (
                    <Icon
                      icon="tabler:alert-circle"
                      fontSize={17}
                      style={{ color: color }}
                    />
                  )}
                  {value === "Unconfirmed" && (
                    <Icon
                      icon="tabler:clock"
                      fontSize={17}
                      style={{ color: color }}
                    />
                  )}

                  <p>{value || "None"}</p>
                </div>
              );
            },
          },
        ]
      : []),
    ...(type !== "dashboard"&&activeTab === "approval-pending"
      ? [
          {
            accessorKey: "action",
            header: "Action",
            cell: ({ getValue }: { getValue: () => any }) => {
              const value = getValue();
              return (
                <div className="flex items-center justify-start gap-3">
                  {activeTab === "approval-pending" && (
                    <div className="flex items-center justify-center font-medium py-[2px] rounded-sm gap-2 max-w-max px-[10px] text-[14px] border">
                      <button
                        className="text-[#72B866] flex items-center justify-center"
                        onClick={() =>handleUpdateAptStatus?.({aptId:value?.id,status:"accepted"})}
                      >
                        <Icon icon="charm:tick" width={15} height={15} />
                        Approve
                      </button>
                      <button
                        className="text-[#F47C7C] flex items-center justify-center"
                        onClick={() => handleUpdateAptStatus?.({aptId:value?.id,status:"declined"})}
                      >
                        <Icon icon="basil:cross-solid" width={25} height={25} />
                        Decline
                      </button>
                    </div>
                  )}
                  <Icon
                    icon="iconamoon:eye-thin"
                    width={25} height={25} 
                    className="text-[#979797] cursor-pointer"
                    onClick={() => getAppointmentTableData?.(value)}
                  />
                </div>
              );
            },
          },
        ]
      : []),
  ];
  // function convertTo12HourWithTimeZone(timeInput, timeZone, isISO = false) {
  //   let date;

  //   if (isISO) {
  //     // Parse the ISO datetime string
  //     date = parseISO(timeInput);
  //   } else {
  //     // Parse 24-hour time string using a dummy date
  //     date = parse(timeInput, "HH:mm", new Date());
  //   }
  //   console.log(date, "date");

  //   // Convert the date to the specified time zone
  //   const zonedDate = toZonedTime(date, timeZone);
  //   console.log(zonedDate, "zoneddate");

  //   // Format the date object to 12-hour time
  //   return format(zonedDate, "hh:mm a");
  // }
  // Transforms raw appointment data into a format suitable for table display
  const transformedData = tableData?.map((item) => ({
    schedule: item?.date_scheduled
      ? item?.date_scheduled?.split("T")[0]
      : "--/--",
    newReturning: item?.is_new_patient ? "New" : "Returning",
    provider: `${item?.prov_first_name ? item?.prov_first_name : "--/--"} ${
      item?.prov_last_name ? item?.prov_last_name : ""
    }`,
    patient: {
      firstName: item?.pat_first_name || item?.temp_details?.firstName,
      lastName: item?.pat_last_name || item?.temp_details?.lastName,
      profilePic: item?.profile_pic,
    },
    reason: item?.reason_for_visit || "*External",
    aptTime: item?.start_time
      ? {
          time: item?.start_time,
          date: item?.apt_date,
        }
      : "--/--",
    status: (() => {
      if (item?.is_synced === false) {
        return "Unsynced";
      } else if (item?.is_deleted === 1) {
        return "Deleted";
      } else if (item?.pms_apt_status === "Complete") {
        return "Complete";
      } else if (item?.pms_apt_status === "Broken") {
        return "Broken";
      } else if (item?.pms_apt_status === "UnschedList") {
        return "Cancelled";
      } else if (
        item?.pms_apt_status === "Scheduled" &&
        item?.is_confirmed === false
      ) {
        return "Unconfirmed";
      } else if (item?.pms_apt_status === "Scheduled" && item?.is_confirmed) {
        return "Confirmed";
      }
      return ""; // In case no conditions match, return an empty string or other default value
    })(),
    id: item?.id,
    ...(type !== "dashboard" && { action: item }),
  }));

  // *** main return
  return (
    <div className={cn("mt-5", className)}>
      <DataTable
        columns={columns}
        data={transformedData}
        headerClassName={"bg-[#f3f3f3] h-[60px]"}
        tableRowClassName={
          activeTab === "Appointments" ? tableRowClassName : ""
        }
        getAppointmentTableData={
          activeTab === "Appointments" ? getAppointmentTableData : undefined
        }
      />
    </div>
  );
};

export default AppointmentTable;
