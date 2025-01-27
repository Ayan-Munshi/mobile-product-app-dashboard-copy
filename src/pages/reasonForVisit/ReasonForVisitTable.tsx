import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DynamicTableHeader from "@/components/custom/DynamicTableHeader";
import { Typography } from "@/components/custom/Typography";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type TableHeadersType = {
  value: string;
  label: string;
  subHeader?: string;
};

type AppProps = {
  tableHeaders: TableHeadersType[];
  tableData: any[];
  getUpdatedData: (data: any) => void;
  handleToggleActiveStatus: (data: any) => void;
  handleDeleteGetData: (data: any) => void;
};

export function ReasonForVisitTable({
  tableHeaders,
  tableData,
  getUpdatedData,
  handleToggleActiveStatus,
  handleDeleteGetData,
}: AppProps) {
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [switchStates, setSwitchStates] = useState<boolean[]>(
    Array(tableData?.length)?.fill(false)
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
        <TableHeader className="">
          <DynamicTableHeader headers={tableHeaders} />
        </TableHeader>
        <TableBody>
          {tableData?.map((data: any, index: number) => (
            <>
              <TableRow
                className="border-b bg-[#FFFF] text-[#5A5A5A] text-[18px] h-[70px]"
                key={data.id} // Added key for the row
              >
                {tableHeaders?.map((header: TableHeadersType) => {
                  if (header?.value === "name") {
                    return (
                      <TableCell className="cursor-pointer" key={header.value}>
                        {data[header?.value]}
                      </TableCell>
                    );
                  } else if (header?.value === "patientStatus") {
                    return (
                      <TableCell key={header.value}>
                        <div className="flex gap-2 items-center text-center">
                          {data?.for_new_patients ? (
                            <Typography
                              as="div"
                              className="text-[12px] size-5 flex justify-center items-center text-white rounded-[3px] bg-[#5488FF] !aspect-square"
                            >
                              N
                            </Typography>
                          ) : null}
                          {data?.for_returning_patients ? (
                            <Typography
                              as="div"
                              className="text-[12px] size-5 flex justify-center items-center text-white rounded-[3px] bg-[#5488FF] !aspect-square"
                            >
                              R
                            </Typography>
                          ) : null}
                        </div>
                      </TableCell>
                    );
                  } else if (header?.value === "providers") {
                    return (
                      <TableCell key={header.value}>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button>
                                <Typography as="p" className="cursor-pointer">
                                  {data?.providers?.length
                                    ? `${data.providers.length} Selected`
                                    : "--/--"}
                                </Typography>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-600 text-white max-w-[370px]">
                              {data?.providers?.map(
                                (provider: any, index: number) => (
                                  <span key={provider.provider_id}>
                                    {provider.provider_first_name} &nbsp;
                                    {provider.provider_last_name}
                                    {index < data.providers.length - 1 && " , "}
                                  </span>
                                )
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    );
                  } else if (header?.value === "operatories") {
                    return (
                      // <TableCell key={header.value}>
                      //   {data?.operatories?.length} Selected
                      // </TableCell>

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
                                (operatory: string, index: number) => (
                                  <span key={operatory}>
                                    {operatory}
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
                              data?.is_active ? "!bg-[#5488FF]" : "bg-gray-300"
                            }`}
                            thumbSize="h-4 w-4"
                            checked={data?.is_active} // Check if this switch is active
                            onCheckedChange={() => {
                              handleSwitchChange(index);
                              handleToggleActiveStatus(data);
                            }} // Trigger switch change
                          ></Switch>
                        </div>
                      </TableCell>
                    );
                  } else if (header?.value === "duration") {
                    return (
                      <TableCell key={header.value}>
                        {/* <div className="flex items-center space-x-2"> */}
                        <p>
                          {data?.final_duration
                            ? `${data?.final_duration} mins`
                            : "--/--"}
                        </p>
                        {/* </div> */}
                      </TableCell>
                    );
                  } else if (header?.value === "action") {
                    return (
                      <div className="">
                        <TableCell key={header.value} className="px-3.5">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div>
                                  <Icon
                                    onClick={() => {
                                      getUpdatedData(data);
                                      togglePopup();
                                    }}
                                    height={21}
                                    icon="basil:edit-outline"
                                    className="cursor-pointer text-gray-500 mt-3 hover:text-blue-400"
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-600 text-white">
                                <p>Edit</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        {""}
                        <TableCell key={header.value} className="px-3.5">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div>
                                  <Icon
                                    onClick={() => {
                                      handleDeleteGetData(data);
                                    }}
                                    height={19}
                                    icon="streamline:recycle-bin-2"
                                    className="cursor-pointer text-gray-500 self-center mt-2 hover:text-red-400"
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-600 text-white">
                                <p>Delete</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                      </div>
                    );
                  }
                  return null; // Return null if no matching case
                })}
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
