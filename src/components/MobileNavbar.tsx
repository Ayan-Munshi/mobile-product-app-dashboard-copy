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
import MobilePracticeLocation from "./custom/MobilePracticeLocation";

export default function MobileNavbar() {
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
    <nav
      className="fixed bottom-5 right-5 left-5 w-auto h-[80px] bg-white rounded-xl flex items-center justify-around shadow-lg z-50"
      role="navigation"
      aria-label="Bottom navigation bar"
    >
       <AppDrawer />
     
      {/* <PracticeLocation />  */}
      <MobilePracticeLocation
      />
      <Icon icon="fluent:home-24-regular" width="40" height="40" className="text-[#3966d3] "/>
      <Icon icon="solar:user-outline" width="39" height="39" className="text-[#3966d3] " />
     <div onClick={handleLogout} >
     <Icon icon="streamline:logout-1" width="40" height="40" className="text-[#3966d3] " />
     </div>
     
    </nav>
  );
}
