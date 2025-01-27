import Skeleton from "react-loading-skeleton";

const SkeletonAddAndEditReasonForVisitData = () => {
  return (
    <div className="grid grid-cols-12 px-9 py-5 min-h-[650px]">
      {/** first row */}
      <div className="col-start-1 col-end-4 mt-2">
        <Skeleton height={14} width="30%" />
        <Skeleton height={54} width="100%" />
      </div>
      <div className="col-start-5 col-end-8 mt-2">
        <Skeleton height={14} width="30%" />
        <Skeleton height={54} width="100%" />
      </div>
      <div className="col-start-9 col-end-12 mt-2">
        <Skeleton height={14} width="30%" />
        <Skeleton height={54} width="100%" />
      </div>
      {/** second row */}
      <div className="col-start-1 col-end-5 mt-10 ">
        <Skeleton height={14} width="20%" containerClassName="" />
        <div className="flex">
          <Skeleton height={54} width="80%" containerClassName=" w-1/2" />
          <Skeleton height={54} width="80%" containerClassName=" w-1/2" />
        </div>
      </div>
      <div className="col-start-5 col-end-8 mt-10 ">
        <Skeleton height={14} width="30%" />
        <Skeleton height={54} width="100%" />
      </div>
      <div className="col-start-9 col-end-12 mt-10">
        <Skeleton height={14} width="30%" />
        <Skeleton height={54} width="100%" />
      </div>
      {/** Third row */}
      <div className="col-start-1 col-end-4 mt-8 ">
        <Skeleton height={14} width="30%" />
        <Skeleton height={54} width="100%" />
      </div>
      <div className="col-start-5 col-end-8 mt-8">
        <Skeleton height={14} width="30%" containerClassName=" " />
        <div className="flex mt-2">
          <Skeleton height={42} width={46} containerClassName="flex-1" />
          <Skeleton
            height={42}
            width={46}
            containerClassName="flex-1 text-start"
          />
        </div>
      </div>
      <div className="col-start-9 col-end-12 mt-8">
        <Skeleton height={14} width="60%" />
        <Skeleton height={54} width="100%" containerClassName="" />
      </div>
      {/** Fourth row */}
      <div className="col-start-1 col-end-12 mt-5">
        <Skeleton height={14} width={70} />
        <Skeleton height={120} width="100%" containerClassName=" flex-1 " />
      </div>

      <div className="col-start-1 col-end-13 flex gap-2 justify-end mt-6">
        <Skeleton height={41} width={125} className="rounded-[7px] " />
        <Skeleton height={41} width={125} className="rounded-[7px] " />
      </div>
    </div>
  );
};

export default SkeletonAddAndEditReasonForVisitData;
