import { Typography } from "@/components/custom/Typography";
import PracticesTable from "./PracticesTable";
import { Button } from "@/components/ui/button";
import AddPractice from "./AddPractice";
import { useEffect, useState } from "react";
import { practiceTableHeaders } from "@/constant/tableheaders/practice";
import {
  useAddPracticeMutation,
  useGetPracticeListQuery,
} from "@/redux/practiceDashBoard/apiSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SkeletonPracticesTable from "@/components/custom/skeletons/SkeletonPracticesTable";

//*** Main return function
const Practices = () => {
  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);
  const { data: practiceList = [], isFetching } =
    useGetPracticeListQuery<any>();

  const [addPractice, { error, data }] = useAddPracticeMutation(); // from api slice

  useEffect(() => {
    if (data) {
      toast.success("Practice added successfully");
      setIsOpenDrawer(false);
    } else if (error) {
      toast.error(error?.message || "Something went wrong");
    }
  }, [data, error]);

  const toggleDrawer = () => {
    setIsOpenDrawer(!isOpenDrawer);
  };

// *** main return
  return (
    <>
      <div id="practice" className="p-10 grid grid-cols-12">
        <div
          id="table"
          className="col-span-12 border rounded-[20px] bg-[#FFFF]"
        >
          <div className="flex justify-between py-4 px-6 items-center">
            <Typography
              as="h2"
              className="text-[#000000] font-medium text-[24px]"
            >
              Practice
            </Typography>
            <Button
              className="border bg-[#769FFD] hover:bg-[#769FFD] border-[#769FFD] rounded-[7px] min-w-[110px] min-h-12 text-[18px] items-center"
              onClick={toggleDrawer}
            >
              + Add
            </Button>
          </div>

          {isFetching ? (
            <SkeletonPracticesTable />
          ) : (
            <div>
              <PracticesTable
                tableData={practiceList?.result}
                tableHeaders={practiceTableHeaders}
                // getUpdatedData={getUpdatedData}
              />
            </div>
          )}
        </div>
      </div>
      {isOpenDrawer && (
        <AddPractice
          isOpen={isOpenDrawer}
          onClose={toggleDrawer}
          addPractice={addPractice}
        />
      )}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default Practices;
