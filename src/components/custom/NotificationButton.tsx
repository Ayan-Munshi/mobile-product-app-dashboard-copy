import { User, CreditCard, Settings, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/react/dist/iconify.js";
import moment from "moment"; // Import moment.js

export default function DropdownMenuDemo() {
  const menuItems = [
    {
      icon: <User className="mr-2 h-4 w-4" />,
      label:
        "Notification 1 with a longer text that should wrap onto multiple lines",
      timestamp: new Date().getTime() - 10 * 60000, // 10 minutes ago
    },
    {
      icon: <CreditCard className="mr-2 h-4 w-4" />,
      label: "Notification 1 with a longer text that should wrap onto ",
      timestamp: new Date().getTime() - 30 * 60000, // 30 minutes ago
    },
    {
      icon: <Settings className="mr-2 h-4 w-4" />,
      label: "Notification 1 with a longer text that should ",
      timestamp: new Date().getTime() - 45 * 60000, // 45 minutes ago
    },
    {
      icon: <Keyboard className="mr-2 h-4 w-4" />,
      label: "Notification 1 with a longer text ",
      timestamp: new Date().getTime() - 60 * 60000, // 60 minutes ago
    },
  ];

  // Function to calculate time ago with more precision
  const getTimeAgo = (timestamp: any) => {
    const now = moment();
    const duration = moment.duration(now.diff(timestamp));

    // Check if it's less than 60 minutes, show minutes
    if (duration.asMinutes() < 60) {
      return `${Math.floor(duration.asMinutes())} minutes ago`;
    }

    // Otherwise, return the standard fromNow format
    return moment(timestamp).fromNow();
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-11 w-11 bg-gray-100 p-2">
          <Icon
            icon="mage:notification-bell"
            style={{ width: "26px", height: "26px", color: "#00091EBA" }}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[350px] text-center mr-5 px-0">
        <DropdownMenuGroup>
          {menuItems.map((item, index) => (
            <DropdownMenuItem
              key={index}
              className="flex flex-col items-start border-b border-gray-100 rounded-none"
            >
              <div className="flex w-full text-start">
                {item.icon}
                <span className="ml-2 break-words flex-1 text-left text-[15px]">
                  {item.label}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-normal ml-8">
                {getTimeAgo(item.timestamp)}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuLabel className="rounded-[10px]">
          <a href="#" className="text-blue-500">
            See all notifications
          </a>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
