import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DynamicTableHeader from "@/components/custom/DynamicTableHeader";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Switch } from "@/components/ui/switch";
import UserProfile from "@/components/custom/UserProfile";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Typography } from "@/components/custom/Typography";

export type TableHeadersType = {
  value: string;
  label: string;
  subHeader?: string;
};

type AppProps = {
  tableHeaders: TableHeadersType[];
  tableData: any[];
  getUpdatedData: (data: any) => void;
};

const ProvidersTable = ({
  tableHeaders,
  tableData,
  getUpdatedData,
}: AppProps) => {
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [switchStates, setSwitchStates] = useState<boolean[]>(
    Array(tableData.length).fill(false)
  ); // State to keep track of each switch

  const togglePopup = () => {
    setOpenPopup(!openPopup);
  };

  const handleSwitchChange = (index: number) => {
    const updatedSwitchStates = [...switchStates]; // Create a copy of the current switch states
    updatedSwitchStates[index] = !updatedSwitchStates[index]; // Toggle the state of the specific switch
    setSwitchStates(updatedSwitchStates); // Update the switch states
  };

  return (
    <>
      <Table className="rounded-lg">
        <TableHeader>
          <DynamicTableHeader headers={tableHeaders} />
        </TableHeader>
        <TableBody>
          {tableData?.length ? (
            tableData?.map((data: any, index: number) => (
              <>
                <TableRow
                  className="border-b bg-[#FFFF] text-[#5A5A5A] text-[18px] h-[70px]"
                  key={data.invoice} // Added key for the row
                >
                  {tableHeaders?.map((header: TableHeadersType) => {
                    if (header?.value === "name") {
                      return (
                        <TableCell
                          className="flex items-center gap-3"
                          key={header.value}
                        >
                          {data?.display_name || data?.pms_first_name ? (
                            <UserProfile
                              firstName={
                                data?.display_name || data?.pms_first_name
                              }
                              lastName={
                                !data?.display_name ? data?.pms_last_name : ""
                              }
                              size="40"
                              fontSize={2.4}
                              profilePic={data?.profile_pic}
                            />
                          ) : (
                            ""
                          )}
                        </TableCell>
                      );
                    } else if (header?.value === "providers") {
                      return (
                        <TableCell key={header.value}>
                          {`${data?.pms_first_name || ""} ${
                            data?.pms_last_name || ""
                          }` || "--/--"}
                        </TableCell>
                      );
                    } else if (header?.value === "id") {
                      return (
                        <TableCell key={header.value}>
                          {data?.pms_prov_num || "--/--"}
                        </TableCell>
                      );
                    } else if (header?.value === "role") {
                      return (
                        <TableCell key={header.value}>
                          <Typography as="p" className=" capitalize">
                            {data?.role || "--/--"}
                          </Typography>
                        </TableCell>
                      );
                    } else if (header?.value === "operatories") {
                      return (
                        <TableCell key={header.value}>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button>
                                  <Typography as="p" className="cursor-pointer">
                                    {data?.operatories?.length
                                      ? `${data.operatories.length} Selected`
                                      : "--/--"}
                                  </Typography>
                                </button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-600 text-white max-w-[350px]">
                                {data?.operatories?.map(
                                  (operatory: any, index: number) => (
                                    <span
                                      key={operatory?.operatory_id || index}
                                    >
                                      {operatory?.operatory_name || operatory}
                                      {index < data.operatories.length - 1 &&
                                        " , "}
                                    </span>
                                  )
                                )}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                      );
                    } else if (header?.value === "active") {
                      return (
                        <TableCell key={header.value}>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="airplane-mode"
                              className={`relative inline-flex items-center justify-between w-10 h-5 bg-gray-300 rounded-full transition-colors duration-200 ${
                                switchStates[index]
                                  ? "!bg-[#5488FF]"
                                  : "bg-gray-300"
                              }`}
                              thumbSize="h-4 w-4"
                              checked={switchStates[index]} // Check if this switch is active
                              onCheckedChange={() => handleSwitchChange(index)} // Trigger switch change
                            ></Switch>
                          </div>
                        </TableCell>
                      );
                    } else if (header?.value === "action") {
                      return (
                        <TableCell key={header.value}>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Icon
                                  onClick={() => {
                                    getUpdatedData(data);
                                    togglePopup();
                                  }}
                                  height={20}
                                  icon="basil:edit-outline"
                                  className="cursor-pointer hover:text-blue-400 "
                                />
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-600 text-white">
                                <p>Edit</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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
                  Please enable providers from the dropdown
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default ProvidersTable;
