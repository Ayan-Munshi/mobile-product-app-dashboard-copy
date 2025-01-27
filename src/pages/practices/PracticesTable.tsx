import DynamicTableHeader from "@/components/custom/DynamicTableHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableHeadersType } from "../providers/ProvidersTable";
import UserProfile from "@/components/custom/UserProfile";
import { twMerge } from "tailwind-merge";
import { PracticeListType } from "@/types/practices";
import { TableHeaderType } from "@/types/commonType";

type AppProps = {
  tableHeaders: TableHeaderType[];
  tableData: PracticeListType[];
};

//*** Main return function
const PracticesTable = ({ tableHeaders, tableData }: AppProps) => {
  
  // *** main return
  return (
    <Table className="rounded-lg">
      <TableHeader>
        <DynamicTableHeader headers={tableHeaders} />
      </TableHeader>
      <TableBody>
        {tableData?.length ? (
          tableData?.map((data: any) => (
            <>
              <TableRow
                className="border-b bg-[#FFFF] text-[#5A5A5A] text-[18px] h-[70px]"
                key={data.invoice} // Added key for the row
              >
                {tableHeaders?.map((header: TableHeadersType) => {
                  if (header?.value === "practiceName") {
                    return (
                      <TableCell className="cursor-pointer " key={header.value}>
                        <UserProfile
                          firstName={data?.name}
                          profilePic={data?.logo}
                          showFullName
                          size="40"
                        />
                      </TableCell>
                    );
                  } else if (header?.value === "phone") {
                    return (
                      <TableCell key={header.value}>
                        {`${data?.phone || ""}` || "--/--"}
                      </TableCell>
                    );
                  } else if (header?.value === "PMS") {
                    return <TableCell key={header.value}>OD</TableCell>;
                  } else if (header?.value === "timeZone") {
                    return (
                      <TableCell key={header.value}>
                        {data?.server_tz || "--/--"}
                      </TableCell>
                    );
                  } else if (header?.value === "location") {
                    return (
                      <TableCell key={header.value}>
                        {data?.city && data?.state
                          ? `${data?.city}, ${data?.state}`
                          : data?.city || data?.state
                          ? `${data.city || data.state}`
                          : "--/--"}
                      </TableCell>
                    );
                  } else if (header?.value === "Accepting Patients") {
                    return (
                      <TableCell key={header.value}>
                        {/* <div className="flex items-center justify-between w-[90px] text-[16px] bg-[#ECECEC] px-3 py-1 rounded-xl">
                          <div className="bg-[#54BF41] h-2 w-2 rounded-full"></div>
                          <div className="ml-2">Active</div>
                        </div> */}
                        <div className="flex items-center justify-between w-max text-[16px] bg-[#ECECEC] px-3 py-1 rounded-xl">
                          <div
                            className={twMerge(
                              "h-2 w-2 rounded-full",
                              data?.is_accepting_patients
                                ? "bg-[#54BF41]"
                                : "bg-[#bf4141] "
                            )}
                          ></div>
                          <div className="ml-2">
                            {data?.is_accepting_patients
                              ? "Active"
                              : "Inactive"}
                          </div>
                        </div>
                      </TableCell>
                    );
                  } else if (header?.value === "PMS Connection") {
                    return (
                      <TableCell key={header.value}>
                        {data?.is_server_live ? (
                          <div className="flex items-center justify-between w-max text-[16px] bg-[#ECECEC] px-3 py-1 rounded-xl">
                            <div className="bg-[#54BF41] h-2 w-2 rounded-full"></div>
                            <div className="ml-2">Active</div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between w-max text-[16px] bg-[#ECECEC] px-3 py-1 rounded-xl">
                            <div className="bg-[#bf4141] h-2 w-2 rounded-full"></div>
                            <div className="ml-2">Inactive</div>
                          </div>
                        )}
                      </TableCell>
                    );
                  } else {
                    return <TableCell key={header.value}>--/--</TableCell>; // Add key here
                  }
                })}
              </TableRow>
            </>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={tableHeaders?.length}>
              <div className="p-10 text-center w-full text-[20px]">
                Please add a practice
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default PracticesTable;
