import Skeleton from "react-loading-skeleton";

const SkeletonProvidersTable = () => {
  const skeletonItems = Array(4).fill(null);

  return (
    <>
      <div className="h-[68px] flex gap-1 items-center border-y ">
        <Skeleton
          height={19}
          width="60%"
          containerClassName="flex-1  text-start pl-3"
        />
        <Skeleton
          height={18}
          width="30%"
          containerClassName="flex-1  text-center"
        />

        <Skeleton
          height={20}
          width="40%"
          containerClassName="flex-1  text-start"
        />

        <Skeleton
          height={18}
          width="35%"
          containerClassName="flex-1  text-center"
        />
        <Skeleton
          height={0}
          width={0}
          containerClassName="max-w-[180px] w-full "
        />
        <Skeleton height={19} width="40%" containerClassName="flex-1  " />
        <Skeleton
          height={17}
          width="50%"
          containerClassName="flex-1  text-center"
        />
      </div>
      <div className="">
        {skeletonItems.map((_, index) => (
          <div
            className="h-[74px] flex gap-1 items-center  border-b  "
            key={index}
          >
            <div className="flex items-center justify-start flex-1 gap-1  pl-4">
              <Skeleton
                height={40}
                width={40}
                circle
                containerClassName=" text-end"
              />
              <Skeleton height={15} width="80%" containerClassName="w-1/2" />
            </div>
            <Skeleton
              height={18}
              width="30%"
              containerClassName="flex-1  text-center "
            />
            <Skeleton
              height={18}
              width="40%"
              containerClassName="flex-1  text-start "
            />
            <Skeleton
              height={20}
              width="30%"
              containerClassName="flex-1  text-center "
            />
            <Skeleton
              height={0}
              width={0}
              containerClassName="max-w-[180px] w-full "
            />
            <Skeleton
              height={20}
              width="30%"
              containerClassName="flex-1  text-start "
            />
            <Skeleton
              height={20}
              width="30%"
              containerClassName="flex-1  text-center "
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default SkeletonProvidersTable;
