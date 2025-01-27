import Skeleton from "react-loading-skeleton";

const SkeletonAdvanceProvidersFormSetting = () => {
  const skeletonItems = Array(7).fill(null);
  return (
    <div className="grid grid-cols-12 p-3">
      <div className="col-span-full mt-[18px] ">
        {skeletonItems.map((_, index) => (
          <div
            key={index}
            className="col-span-full h-[48px] flex mt-[14px] items-center"
          >
            <Skeleton height={24} width="40%" containerClassName="flex-1" />
            <Skeleton
              height={56}
              width="80%"
              containerClassName="flex-1 text-end"
            />
            <div className="flex-1"></div>
          </div>
        ))}
      </div>
      <div className="col-start-10 col-end-13 flex gap-2 justify-end mt-3 ">
        <Skeleton
          height={39}
          width="100%"
          className=" rounded-[7px] "
          containerClassName="flex-1 "
        />
        <Skeleton
          height={39}
          width="100%"
          className=" rounded-[7px]"
          containerClassName="flex-1"
        />
      </div>
    </div>
  );
};

export default SkeletonAdvanceProvidersFormSetting;
