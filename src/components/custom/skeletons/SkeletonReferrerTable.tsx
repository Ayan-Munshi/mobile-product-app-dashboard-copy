import Skeleton from "react-loading-skeleton";

const SkeletonRow = ({ isHeader = false }) => (
  <div
    className={`h-[${isHeader ? "65px" : "71px"}] flex gap-1 items-center px-4 ${
      isHeader ? "border mt-3" : "border-b border-x"
    }`}
  >
    <Skeleton height={19} width="50%" containerClassName="flex-1 text-start" />
    <Skeleton height={19} width="50%" containerClassName="flex-1 text-start" />
    <Skeleton height={19} width="50%" containerClassName="flex-1 text-start" />
    {isHeader ? (
      <Skeleton height={19} width="50%" containerClassName="flex-1 text-start" />
    ) : (
      <div className="flex gap-1 items-center flex-1">
        {Array(3)
          .fill(null)
          .map((_, i) => (
            <Skeleton
              key={i}
              height={20}
              width={20}
              containerClassName="w-1/6 text-start"
            />
          ))}
      </div>
    )}
  </div>
);

const SkeletonReferrerTable = () => (
  <div>
    <SkeletonRow isHeader={true} />
    {Array(5)
      .fill(null)
      .map((_, index) => (
        <SkeletonRow key={index} />
      ))}
  </div>
);

export default SkeletonReferrerTable;
