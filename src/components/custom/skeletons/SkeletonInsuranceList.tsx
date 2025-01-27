import Skeleton from "react-loading-skeleton";

const SkeletonInsuranceList = () => {
  const skeletonItems = Array(6).fill(null);
  return (
    <div>
      {skeletonItems.map((_, index) => (
        <div
          key={index}
          className="h-[60px] border-x border-b flex items-center px-2"
        >
          <Skeleton height={23} width="45%" containerClassName="flex-1" />
          <Skeleton
            height={25}
            width={25}
            circle
            containerClassName="flex-1 text-end"
          />
        </div>
      ))}
    </div>
  );
};

export default SkeletonInsuranceList;
