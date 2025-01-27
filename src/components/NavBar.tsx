import { useEffect, useState } from "react";
import PracticeLocation from "./custom/PracticeLocation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Icon } from "@iconify/react";
import { Typography } from "./custom/Typography";
import {
  useAuthLogoutMutation,
  useGetUserDetailsQuery,
} from "@/redux/practiceDashBoard/apiSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { persistUserDetails, resetAuth } from "@/redux/practiceDashBoard/slice";
import { RootState } from "@/redux/store";
import Avatar from "react-avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import AppDrawer from "./custom/AppDrawer";
import MobileNavbar from "./MobileSidebar";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [authLogout] = useAuthLogoutMutation();
  const { data: userDetails } = useGetUserDetailsQuery(undefined);
  const userData = useSelector(
    (state: RootState) => state?.persisted?.practice?.userDetails
  );

  useEffect(() => {
    if (userDetails?.result?.billing_name) {
      dispatch(persistUserDetails(userDetails?.result));
    }
  }, [userDetails?.result]);

  const handleLogout = async () => {
    try {
      const result = await authLogout(undefined).unwrap();
      if (result?.success) {
        dispatch(resetAuth());
        navigate("/login");
      }
    } catch (error) {}
  };



  return (
    <div
      id="nav-bar"
      className={`flex gap-7 justify-end items-center py-[7px] px-6 bg-white sticky top-0 w-full z-[99] drop-shadow-sm`}
    >
      <PracticeLocation />
      <AppDrawer />
      <div className="flex space-x-[18px] items-center">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <div>
              <Avatar size="42" round name={userData?.billing_name} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-h-[180px] w-[250px] mr-3 py-0 px-0 rounded-[7px]">
            <DropdownMenuLabel className="flex items-center gap-2 py-[14px]">
              <div className="relative">
                <Avatar size="40" round name={userData?.billing_name} />
              </div>

              <div className="flex flex-col gap-0.5 justify-center truncate">
                <Typography
                  as="h2"
                  className="font-semibold text-gray-700 text-[18px]"
                >
                  {userData?.billing_name}
                </Typography>
                <TooltipProvider delayDuration={10}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-base font-normal truncate overflow-hidden whitespace-nowrap text-gray-600 cursor-pointer">
                        {userData?.email}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="text-base font-normal bg-gray-600 text-white "
                    >
                      {userData?.email}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="h-[2px] mt-0 mb-0" />

            <DropdownMenuItem
              className="space-x-3 px-2 py-3 hover:bg-gray-300 cursor-pointer rounded-none mt-0"
              onClick={() => navigate("/account-settings")}
            >
              <Icon
                icon="mingcute:settings-3-line"
                style={{
                  width: "25px",
                  height: "25px",
                  color: "gray",
                }}
              />
              <span className="text-base font-normal">Account settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="h-[2px] mt-0 mb-0" />

            <DropdownMenuItem
              className="space-x-3 px-2 py-3 hover:bg-gray-300 cursor-pointer rounded-none mt-0"
              onClick={handleLogout}
            >
              <Icon
                icon="material-symbols:logout"
                style={{
                  width: "25px",
                  height: "25px",
                  color: "gray",
                }}
              />
              <span className="text-base">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>)
  
};

export default NavBar;
