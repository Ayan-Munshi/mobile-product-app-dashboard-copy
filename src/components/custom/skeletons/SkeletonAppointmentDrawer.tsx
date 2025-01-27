import Skeleton from "react-loading-skeleton";

const SkeletonAppointmentDrawer = () => {
  return (
    <div className=" ">
      {/* row 1 */}
      <div className="mt-[130px]   px-4">
        <div className=" flex gap-1">
          <Skeleton height={27} width="60%" containerClassName="  flex-1" />
          <Skeleton height={27} width="75%" containerClassName="  flex-1" />
        </div>
        <div className="mt-9 flex gap-1 ">
          <Skeleton height={22} width="60%" containerClassName="  flex-1" />
          <Skeleton height={32} width="60%" containerClassName="  flex-1" />
        </div>
        <div className=" mt-10 flex gap-1">
          <Skeleton height={28} width="60%" containerClassName="  flex-1" />
          <Skeleton height={28} width="60%" containerClassName="  flex-1" />
        </div>
      </div>
      <hr className="my-5" />
      {/* row 2 */}
      <div className="  px-4 ">
        <div className="flex mt-12">
          <Skeleton height={26} width="50%" containerClassName="  flex-1" />
          <Skeleton height={26} width="80%" containerClassName="  flex-1" />
        </div>
        <div className="flex mt-9">
          <Skeleton height={20} width="45%" containerClassName="  flex-1" />
          <Skeleton height={26} width="80%" containerClassName="  flex-1" />
        </div>
        <div className="mt-14">
          <Skeleton height={26} width="45%" containerClassName="  flex-1" />
        </div>
        <div className="mt-9">
          <Skeleton height={18} width="55%" containerClassName="  flex-1" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonAppointmentDrawer;
