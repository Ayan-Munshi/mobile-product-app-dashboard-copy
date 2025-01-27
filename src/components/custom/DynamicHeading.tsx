import React from "react";

interface DynamicHeadingProps {
  text: string;
  className?: string;
  hType: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const DynamicHeading: React.FC<DynamicHeadingProps> = ({
  text,
  hType,
  className,
}) => {
  let heading;

  switch (hType) {
    case "h1":
      heading = (
        <h1
          className={` ${
            className
              ? className
              : "text-[20px] lg:text-[28px] tracking-wide font-normal text-[#666565]"
          }`}
        >
          {text}
        </h1>
      );
      break;
    case "h2":
      heading = (
        <h2
          className={`text-3xl ${
            className ? className : "text-gray-500 font-normal"
          }`}
        >
          {text}
        </h2>
      );
      break;
    case "h3":
      heading = (
        <h3
          className={`text-2xl ${
            className ? className : "text-gray-500 font-normal"
          }`}
        >
          {text}
        </h3>
      );
      break;
    case "h4":
      heading = (
        <h4
          className={`text-1xl ${
            className ? className : "text-gray-500 font-normal"
          }`}
        >
          {text}
        </h4>
      );
      break;
    case "h5":
      heading = (
        <h5
          className={`text-1xl ${
            className ? className : "text-gray-500 font-normal"
          }`}
        >
          {text}
        </h5>
      );
      break;
    case "h6":
      heading = (
        <h6
          className={`text-1xl ${
            className ? className : "text-gray-500 font-normal"
          }`}
        >
          {text}
        </h6>
      );
      break;
    default:
      heading = (
        <h1
          className={`text-4xl ${
            className ? className : "text-gray-500 font-normal"
          }`}
        >
          {text}
        </h1>
      ); // Fallback to h1 if no valid hType is provided
  }

  return heading;
};

export default DynamicHeading;
