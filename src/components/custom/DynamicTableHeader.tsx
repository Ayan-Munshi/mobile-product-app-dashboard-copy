import { TableHead, TableRow } from "../ui/table";

export type TableHeadersType = {
  value: string;
  label: string;
  subHeader?: string;
  maxWidth?: string;
};

type AppProps = {
  headers: TableHeadersType[];
};

const DynamicTableHeader = ({ headers }: AppProps) => {
  return (
    <TableRow className="bg-[#F8FAFF61] border border-l-0 h-[65px]">
      {headers?.map((header: TableHeadersType) => {
        return (
          <TableHead
            key={header?.label}
            className="text-left text-[18px] text-[#5A5A5AB5] "
            style={{ width: header?.maxWidth }}
          >
            <div className="flex flex-col">
              <span className="">{header?.label}</span>
              {header?.subHeader && (
                <span className="text-[14px] text-[#5A5A5A99]">
                  {header?.subHeader}
                </span>
              )}
            </div>
          </TableHead>
        );
      })}
    </TableRow>
  );
};

export default DynamicTableHeader;
