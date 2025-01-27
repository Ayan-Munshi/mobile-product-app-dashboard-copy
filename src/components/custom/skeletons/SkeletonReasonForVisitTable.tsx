import Skeleton from "react-loading-skeleton";

const SkeletonReasonForVisitTable = () => {
  const skeletonItems = Array(5).fill(null);

  return (
    <div className="">
      <div className="h-[65px] flex gap-1 items-center px-4 border-y ">
        <Skeleton height={17} width="30%" containerClassName="flex-1  " />
        <Skeleton
          height={19}
          width="70%"
          containerClassName="flex-1  text-end  "
        />
        <Skeleton
          height={19}
          width="50%"
          containerClassName="flex-1  text-center  "
        />
        <Skeleton
          height={19}
          width="50%"
          containerClassName="text-end flex-1   "
        />
        <Skeleton
          height={17}
          width="50%"
          containerClassName="text-end flex-1  "
        />
        <Skeleton
          height={17}
          width="50%"
          containerClassName=" flex-1 text-end  "
        />

        <Skeleton
          height={17}
          width="60%"
          containerClassName="flex-1 text-center"
        />
      </div>
      <div className="">
        {skeletonItems.map((_, index) => (
          <div
            className="h-[71px] flex gap-1 items-center px-4 border-b"
            key={index}
          >
            <Skeleton height={19} width="50%" containerClassName="flex-1 " />
            <div className="flex gap-1 justify-center items-center flex-1 ">
              <Skeleton height={20} width={20} containerClassName="" />
              <Skeleton height={20} width={20} containerClassName="" />
            </div>
            <Skeleton
              height={19}
              width="40%"
              containerClassName="flex-1 text-center  "
            />
            <Skeleton
              height={21}
              width="50%"
              containerClassName="flex-1  text-end  "
            />
            <Skeleton
              height={24}
              width="40%"
              containerClassName="flex-1  text-end  "
            />
            <Skeleton
              height={21}
              width="40%"
              containerClassName="flex-1 text-end  "
            />
            <div className="flex gap-1  items-center flex-1 ">
              <Skeleton
                height={20}
                width={20}
                containerClassName="w-1/2  text-center  "
              />
              <Skeleton
                height={20}
                width={20}
                containerClassName="w-1/2 text-start  "
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonReasonForVisitTable;
