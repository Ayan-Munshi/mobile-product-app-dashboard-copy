import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TemplateSkeleton = () => {
  return (
    <>
      <div className="flex gap-3">
        <Skeleton height={45} width={100} />
        <Skeleton height={45} width={100} />
      </div>
      <div className="mt-5">
        <Skeleton width="100%" height={50} containerClassName="flex-1" />
      </div>
      <div className="mt-5">
        <Skeleton width="100%" height={50} containerClassName="flex-1" />
      </div>

      {/* Skeleton for form content (Email and Text Tabs) */}
      <div className="mt-5">
        <Skeleton width="100%" height={250} containerClassName="flex-1" />{" "}
        {/* Skeleton for form content */}
      </div>
      <div className="mt-5">
        <Skeleton width="100%" height={40} containerClassName="flex-1" />{" "}
        {/* Skeleton for button */}
      </div>
    </>
  );
};

export default TemplateSkeleton;
