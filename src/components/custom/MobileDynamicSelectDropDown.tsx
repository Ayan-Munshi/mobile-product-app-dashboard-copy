import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useRef, useState } from "react";
import { Control, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import UserProfile from "./UserProfile";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type DynamicCheckBoxDropDownProps = {
  name: string;
  control: Control<any>;
  options: any[];
  selected: any;
  classname: string;
  footer: boolean;
};

const MobileDynamicSelectDropDown = ({
  name,
  control,
  options = [], // Ensure options is always an array
  selected, // Current location or selected option
  classname,
  footer,
}: DynamicCheckBoxDropDownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  // Always initialize selectedOption with `selected` or fallback to the first option
  const [selectedOption, setSelectedOption] = useState(
    selected || options[0] || null
  );

  useEffect(() => {
    // Update selectedOption when the selected prop changes
    setSelectedOption(selected || options[0] || null);
  }, [selected, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleDropdown();
    }
  };

  return (
    <Drawer>
      <div
        className="relative w-full max-w-xs cursor-pointer"
        ref={dropdownRef}
      >
        <div
          onClick={toggleDropdown}
          className="flex items-center justify-between rounded-md focus:ring-2 focus:ring-gray-400 focus:outline-none "
        >
          <div className="p-2 flex items-center gap-3 flex-grow text-gray-700 truncate">
            {/* <UserProfile
            firstName={selectedOption?.name}
            profilePic={selectedOption?.logo}
            showFullName
            size="40"
          /> */}
            <DrawerTrigger className="">
              <button
                type="button"
                onKeyDown={handleKeyDown}
                className="px-3 py-3 bg-white"
                ref={buttonRef}
              >
                <Icon
                  icon="fluent:dentist-16-regular"
                  width="40"
                  height="40"
                  className="text-[#3966d3]"
                />
              </button>
            </DrawerTrigger>
          </div>
          {/* <button
            type="button"
            onKeyDown={handleKeyDown}
            className="px-3 py-3 bg-white"
            ref={buttonRef}
          >
            <Icon
              icon="iconamoon:arrow-down-2-light"
              className="text-gray-500 size-6"
            />
          </button> */}
        </div>

        <DrawerContent className="h-max">
          <DrawerHeader>
            <DrawerTitle>Practice locations</DrawerTitle>
          </DrawerHeader>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <div
                className={`left-0 w-full  border shadow-lg rounded-md mt-1 z-10 ${
                  isOpen ? "block" : "hidden"
                } ${classname}`}
              >
                {options.map((option) => (
                  <label
                    key={option.id}
                    className="block px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100 focus:bg-blue-100"
                    onClick={() => {
                      field.onChange(option);
                      setSelectedOption(option);
                      toggleDropdown();
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <UserProfile
                        firstName={option?.name}
                        profilePic={option?.logo}
                        showFullName
                        size="30"
                      />
                    </div>
                  </label>
                ))}
              </div>
            )}
          />
          {footer && (
            <DrawerFooter>
                <DrawerClose>
              <p
                onClick={() => navigate("/practices")}
                className="flex justify-between px-5 py-3  text-[14px] font-semibold text-gray-500 border-t"
              >
                <span>Show all</span>
                <span>⇧⌘L</span>
              </p>
              </DrawerClose>
            </DrawerFooter>
          )}
        </DrawerContent>
      </div>
    </Drawer>
  );
};

export default MobileDynamicSelectDropDown;
