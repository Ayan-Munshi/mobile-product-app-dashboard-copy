import Skeleton from "react-loading-skeleton";

const SkeletonGenralProvidersFormSetting = () => {
  return (
    <div className="grid grid-cols-12  mt-[13px]">
      {/** Text */}
      <div className="col-start-1 col-end-4 flex mt-5 ">
        <div className="flex flex-col w-full ">
          <Skeleton height={20} width="50%" />{" "}
          <Skeleton height={35} width="85%" containerClassName="mt-3" />
        </div>
        {/** Image */}
      </div>
      <div className="col-start-5 col-end-8 mt-5 ">
        <Skeleton circle height={75} width={75} containerClassName="" />
      </div>

      {/** */}
      <div className=" col-start-9 col-end-12 flex flex-col mt-5">
        <Skeleton height={14} width="40%" containerClassName="" />
        <div className="flex mt-2 ">
          <Skeleton height={48} width="60%" containerClassName="flex-1 " />
          <Skeleton height={48} width="60%" containerClassName="flex-1 " />
          <Skeleton height={48} width="60%" containerClassName="flex-1 " />
        </div>
      </div>
      {/** */}
      <div className="col-start-1 col-end-4   mt-12">
        <Skeleton height={14} width="60%" />
        <Skeleton height={55} width="100%" />
      </div>
      <div className="col-start-5 col-end-8  mt-12 ">
        <Skeleton height={14} width="60%" />
        <Skeleton height={55} width="100%" />
      </div>
      <div className="col-start-9 col-end-12  mt-12">
        <Skeleton height={14} width="60%" />
        <Skeleton height={55} width="100%" />
      </div>
      <div className=" col-start-1 col-end-13  mt-11 ">
        <Skeleton height={14} width="15%" />
        <Skeleton height={121} width="100%" />
      </div>
      <div className="col-start-10 col-end-13 flex gap-2 justify-end mt-14 ">
        <Skeleton
          height={39}
          width="100%"
          className=" rounded-[7px] "
          containerClassName="flex-1 "
        />
        <Skeleton
          height={39}
          width="100%"
          className=" rounded-[7px] "
          containerClassName="flex-1 "
        />
      </div>
    </div>
  );
};

export default SkeletonGenralProvidersFormSetting;
