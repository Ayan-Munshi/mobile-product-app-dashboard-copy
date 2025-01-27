import Skeleton from "react-loading-skeleton";

const SkeletonPracticesTable = () => {
  const skeletonItems = Array(3).fill(null);
  return (
    <div className="">
      {/* header */}
      <div className="flex items-center gap-1 h-[64px] border-y px-3">
        <Skeleton
          height={18}
          width="42%"
          containerClassName="flex-1 flex items-center  "
        />
        <div className="flex items-center flex-1 gap-1  ">
          <Skeleton
            height={20}
            width="60%"
            containerClassName=" w-1/2  text-center "
          />
          <Skeleton
            height={20}
            width="40%"
            containerClassName=" w-1/2  text-end "
          />
        </div>
        <Skeleton height={18} width="40%" containerClassName="flex-1 px-6  " />
        <Skeleton
          height={18}
          width="40%"
          containerClassName="flex-1 text-center   "
        />
        <Skeleton
          height={18}
          width="70%"
          containerClassName="flex-1 text-center  "
        />
      </div>
      {/* rows */}
      <div className="">
        {skeletonItems.map((_, index) => (
          <div
            className="h-[74px] flex gap-1 items-center border-b  px-3"
            key={index}
          >
            <div className="flex items-center flex-1 ">
              <Skeleton
                height={40}
                width={40}
                circle
                containerClassName=" w-[15%] "
              />
              <Skeleton
                height={20}
                width="55%"
                containerClassName="w-[85%]  "
              />
            </div>
            <div className="flex items-center flex-1 gap-1  ">
              <Skeleton
                height={20}
                width="75%"
                containerClassName=" w-1/2 text-end"
              />
              <Skeleton
                height={20}
                width="40%"
                containerClassName=" w-1/2  text-end  "
              />
            </div>
            <Skeleton
              height={18}
              width="60%"
              containerClassName="flex-1 px-6   "
            />
            <Skeleton
              height={18}
              width="50%"
              containerClassName="flex-1 text-center   "
            />
            <Skeleton
              height={30}
              width="50%"
              containerClassName="flex-1 text-center  "
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonPracticesTable;
