import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface SkeletonTableProps {
  rows?: number; // Number of rows
  columns?: number; // Number of columns
  skeletonHeight?: number; // Skeleton height
  skeletonClassName?: string; // Additional class names for customization
}

const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4,
  skeletonHeight = 50,
  skeletonClassName = "w-3/5 ml-[20%] rounded-md",
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <Table className="mt-5">
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton
                    height={skeletonHeight}
                    className={skeletonClassName}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SkeletonTable;
