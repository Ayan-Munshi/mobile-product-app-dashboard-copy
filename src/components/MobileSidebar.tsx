import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { NavLink } from "react-router-dom";
import { navItems } from "@/constant/navItems";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MobileNavbar = () => {
  const [openNavbar, setOpenNavbar] = useState(false)
  // const button = () => {
  //     setOpenNavbar(!openNavbar)

  //   }
  return (
    <Sheet
    open={openNavbar}
    onOpenChange={(isOpen) => setOpenNavbar(isOpen)} // Update state when Sheet opens or closes
    >
      <div className="">
        <div className=" flex justify-between bg-white px-5">
          {" "}
          {/* Render mobile version of navbar */}
          <div
            className="flex items-center justify-start min-h-[80px] w-full pt-[3px]"
            role="img"
            aria-label="Logo"
          >
            <img
              src="https://d22gspqa8b57yo.cloudfront.net/assets/favicon-1.png"
              alt="Logo"
              className="cursor-pointer max-w-[60px]"
            />
          </div>
          <SheetTrigger>
            <button
            //  onClick={button}
            >
              <Icon
                icon={`${ openNavbar ? "maki:cross" : "bx:menu-alt-right"}`}
                width="44"
                height="44"
                className="text-[#3A67CE]"
              />
            </button>
          </SheetTrigger>
        </div>

        <SheetContent
          className={` flex flex-col gap-5 top-20 border-[#1e366d] z-50 max-w-[300px] bg-[#1e366d] py-6 px-0 shadow-lg [&_.absolute.right-4.top-4]:hidden`}
          role="navigation"
          aria-label="Bottom navigation bar"
        >
           
           {/* <SheetClose className="bg-red-600 flex justify-end items-center">
            <Icon
              icon="maki:cross"
              className="text-gray-500 size-5 rounded-full border-2 border-gray-400 p-0.5 mt-5 "
            />
          </SheetClose> */}
          
          {navItems.map(({ label, path, icon, width, weight }) => (
            <NavLink
              key={label}
              to={path}
              className={({ isActive }) =>
                `flex gap-10 items-center px-10 py-3 ${
                  isActive ? "text-blue-500 bg-white" : "text-white"
                }`
              }
              role="menuitem"
              tabIndex={0}
            >
              {({ isActive }) => (
                <SheetClose 
                // onClick={button }
                className="flex gap-4 w-full">
                  <Icon
                    icon={icon}
                    style={{
                      width: width,
                      height: width,
                      fontWeight: weight,
                      color: isActive ? "#60a5fa" : "white",
                    }}
                    aria-hidden="true"
                  />
                  <span className="text-sm mt-1">{label}</span>
                </SheetClose>
              )}
            </NavLink>
          ))}
        </SheetContent>
      </div>
    </Sheet>
  );
};

export default MobileNavbar;
