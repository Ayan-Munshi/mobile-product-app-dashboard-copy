import { Icon } from "@iconify/react/dist/iconify.js";

const DesktopOnlyModeNotification = () => {
  return (
    <div className=" min-h-screen flex items-center justify-center ">
      <div className="flex flex-col items-center justify-center drop-shadow-md border bg-white border-gray-100  p-4 w-[90%] md:w-[80%] max-w-[700px] rounded-[10px] ">
        <Icon
          icon="streamline:desktop-emoji"
          width="50"
          height="50"
          className="text-blue-500"
        />
        <p className="text-base text-center leading-[25px] mt-3">
          For the best experience, please use the dashboard on a desktop. We're
          currently improving the mobile experience.
        </p>
      </div>
    </div>
  );
};

export default DesktopOnlyModeNotification;
