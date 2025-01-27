import React, { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import Sidebar from "@/components/SideBar";
//import SmallSidebar from "@/components/SmallSidebar";  // New sidebar component for smaller width
import DesktopOnlyModeNotification from "@/components/custom/DesktopOnlyModeNotification";
import MobileSidebar from "@/components/MobileSidebar";
import MobileNavbar from "@/components/MobileNavbar";

type AppProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: AppProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileScreen, setisMobileScreen] = useState(false);

  // Define checkViewport function with a parameter
  const checkViewport = (viewport: number, setState: React.Dispatch<React.SetStateAction<boolean>>) => {
    setState(window.innerWidth < viewport);
  };

  useEffect(() => {
    checkViewport(1220, setIsMobile); // Check on initial render with the mobile viewport
    checkViewport(1000, setisMobileScreen); // Check on initial render with the small sidebar viewport

    const handleResize = () => {
      checkViewport(1220, setIsMobile); // Adjust mobile state on resize
      checkViewport(1000, setisMobileScreen); // Adjust small sidebar state on resize
    };

    window.addEventListener("resize", handleResize); // Listen for viewport changes

    return () => {
      window.removeEventListener("resize", handleResize); // Clean up event listener
    };
  }, []); // Empty dependency array to run only once on component mount

  const current_year = new Date().getFullYear();

  // if (isMobile) {
  //   return <DesktopOnlyModeNotification />;
  // }

  return (
    <div
      id="layout"
      className="grid lg:grid-cols-[90px_auto] 2xl:grid-cols-[220px_auto]"
    >
      <div className="z-20">
        {/* Conditionally render different sidebars based on viewport size */}
        {isMobileScreen ? <div className="sticky top-0 left-0 z-50 bg-white"> <MobileSidebar/> </div>: <Sidebar />}
      </div>
      <div className="bg-[#f3f3f3] bd-gradient z-[999]">
        {isMobileScreen ? <MobileNavbar/> : <NavBar/>}
        {children}
        <div className="py-2 text-sm text-center">
          Copyright © {current_year} All in One Dental | Version: Beta
        </div>
      </div>
    </div>
  );
};

export default Layout;
