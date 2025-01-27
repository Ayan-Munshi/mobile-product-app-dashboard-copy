import { Typography } from "@/components/custom/Typography";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AppointmentListType } from "@/types/appointments";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ColumnDef } from "@tanstack/react-table";
import ClipboardJS from "clipboard";
import { useEffect, useState } from "react";
import { ReferrerDataTable } from "./ReferrerDataTable";
import { getReferrerDetails } from "@/types/settings";

type AppProps = {
  tableData: getReferrerDetails[];
  className?: string;
  getAppointmentTableData?: (data: AppointmentListType) => void;
  getEditData: (data: any) => void;
  handleDeleteGetData: (data: any) => void;
  tableRowClassName?: string;
  formUrl?: string;
};

//*** Main return function
const ReferrerTable = ({
  tableData,
  getAppointmentTableData,
  tableRowClassName,
  className,
  getEditData,
  handleDeleteGetData,
  formUrl,
}: AppProps) => {
  const domainURL = import.meta.env.VITE_DOMAIN;
  const [copied, setCopied] = useState(false);
  const [copiedId, setCopiedId] = useState("");
  useEffect(() => {
    const clipboard = new ClipboardJS(".copy-button");
    return () => {
      clipboard.destroy();
    };
  }, []);

  const columns: ColumnDef<getReferrerDetails, any>[] = [
    { accessorKey: "name", header: "Name", size: 25 },
    { accessorKey: "id", header: "Referrer ID", size: 25 },
    { accessorKey: "source_type", header: "Source Type", size: 25 },
    {
      accessorKey: "action",
      header: "Action",
      size: 25,
      cell: ({ getValue }) => {
        const value = getValue();

        return (
          <div className="flex gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Icon
                      onClick={() => {
                        getEditData(value);
                      }}
                      height={21}
                      icon="basil:edit-outline"
                      className="cursor-pointer text-gray-500 hover:text-blue-400"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-600 text-white">
                  <p>Edit</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Icon
                      onClick={() => {
                        handleDeleteGetData(value);
                      }}
                      height={19}
                      icon="streamline:recycle-bin-2"
                      className="cursor-pointer text-gray-500 self-center hover:text-red-400"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-600 text-white">
                  <p>Delete</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={10}>
              <Tooltip
                open={copied}
                onOpenChange={(open) => !open && setCopied(false)}
              >
                <TooltipTrigger asChild>
                  <button
                    className="bg-transparent hover:bg-transparent copy-button ml-1"
                    data-clipboard-text={`${domainURL}/${formUrl}?referrer_id=${value?.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      setCopied(true);
                      setCopiedId(value?.id);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                  >
                    <Icon
                      icon="mingcute:copy-line"
                      className="text-gray-500 hover:text-blue-300 size-5"
                    />
                  </button>
                </TooltipTrigger>
                {copiedId == value?.id && (
                  <TooltipContent className="bg-gray-600 ">
                    <Typography as="p" className="text-white">
                      {copied ? "Copied" : "Copy"}
                    </Typography>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];

  const transformedData = tableData?.map((item: getReferrerDetails) => ({
    name: item?.name,
    id: item?.id,
    source_type: item?.source_type,
    action: item,
  }));

  // *** main return
  return (
    <div className={cn("mt-5", className)}>
      <ReferrerDataTable
        columns={columns}
        data={transformedData}
        headerClassName={"bg-[#f3f3f3] h-[60px]"}
        tableRowClassName={tableRowClassName}
        getAppointmentTableData={getAppointmentTableData}
      />
    </div>
  );
};

export default ReferrerTable;
