import { Icon } from "@iconify/react/dist/iconify.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const AppDrawer = () => {
  const iconList = [
    { icon: "solar:calendar-bold-duotone", label: "Scheduling" , route : "#" },
    { icon: "solar:star-bold-duotone", label: "Reviews" , route : "#" },
    { icon: "simple-icons:googleforms", label: "Forms" , route : "#"   },
    {
      icon: "mdi:loudspeaker",
      label: "Campaigns",
      route : "#" 
    },
    { icon: "material-symbols:analytics", label: "Analytics", route : "#"  },
    { icon: "streamline:insurance-hand-solid", label: "Insurance", route : "#"  },
    // Additional menu items can be uncommented here
  ];
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild className="cursor-pointer ">
        <Icon
          icon="fluent:apps-20-regular"
          width="43"
          height="43"
          style={{ color: "#2b6fff" }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white text-gray-700 rounded-lg shadow-lg  border border-[#3A67CE] mt-3">
        <div className="px-5">
          <p className="mt-3 font-[300] text-sm">
            Experience our other <span className="text-blue-500">Apps</span>
          </p>
          <hr className="mt-2"></hr>
        </div>

        <div className="min-h-[260px] w-max p-4 grid grid-cols-2 gap-4 ">
          {iconList.map((item, index) => (
            <DropdownMenuItem
              key={index}
              className="flex gap-2 items-start justify-between focus:bg-gray-200 p-2 rounded-md cursor-pointer border-[0.5px] border-gray-200"
            >
              <a href={item.route} className="flex gap-2 items-center">
                <Icon
                  icon={item.icon}
                  width="38"
                  height="38"
                  className="text-[#3966d3]"
                />
                <div className="flex flex-col text-gray-800 justify-end">
                  <span className="font-[500] text-[15px] ">AOD</span>
                  <span className="text-[15px] font-[400]">{item.label}</span>
                </div>
              </a>

              {item.label !== "Scheduling" && (
                <span className="text-[8.5px] whitespace-nowrap border border-[#3C77FF] px-[5px] bg-[#3c77ff] text-white rounded-sm">
                  Coming soon
                </span>
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AppDrawer;
