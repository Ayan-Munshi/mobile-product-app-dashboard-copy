import Skeleton from "react-loading-skeleton";

type AppProps = {
  rows: number;
};

const SkeletonAppointments = ({ rows }: AppProps) => {
  const skeletonItems = Array(rows).fill(null);
  return (
    <div className="mt-5">
      <div className="flex gap-3 items-center border px-2 rounded-[5px] h-[62px] ">
        <Skeleton height={17} width="60%" containerClassName="flex-1  " />
        <Skeleton
          height={15}
          width="60%"
          containerClassName="flex-1  text-center"
        />
        <Skeleton
          height={15}
          width="60%"
          containerClassName="flex-1 text-start "
        />
        <Skeleton
          height={16}
          width="80%"
          containerClassName="flex-1  text-start "
        />
        <Skeleton height={18} width="55%" containerClassName="flex-1  " />
        <Skeleton height={18} width="55%" containerClassName="flex-1 " />
        <Skeleton
          height={16}
          width="35%"
          containerClassName="flex-1  flex justify-start items-center "
        />
      </div>
      <div className=" ">
        {skeletonItems.map((_, index) => (
          //   <div className="flex h-[73px] w-full" key={index}>
          <div
            className="flex h-[74px]  items-center border-b border-x px-3 "
            key={index}
          >
            <Skeleton height={17} width="50%" containerClassName="flex-1  " />
            <Skeleton
              height={15}
              width="60%"
              containerClassName="flex-1  text-center"
            />
            <Skeleton
              height={15}
              width="40%"
              containerClassName="flex-1 text-start "
            />
            <div className="flex items-center justify-start flex-1 gap-1 ">
              <Skeleton
                height={40}
                width={40}
                circle
                containerClassName=" text-end"
              />
              <Skeleton height={15} width="80%" containerClassName="w-1/2" />
            </div>
            {/* <Skeleton height={0} width={0} containerClassName="flex-1  " /> */}
            <Skeleton
              height={15}
              width="40%"
              containerClassName="flex-1 flex items-center justify-start "
            />
            <Skeleton height={35} width="70%" containerClassName="flex-1 " />
            <Skeleton height={38} width="70%" containerClassName="flex-1  " />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonAppointments;
