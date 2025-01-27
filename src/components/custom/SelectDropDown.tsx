import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useRef, useState } from "react";
import { Control, Controller } from "react-hook-form";
import { Typography } from "./Typography";
import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils";

type DynamicCheckBoxDropDownProps = {
  name: string;
  control: Control<any>;
  options: any[];
  selected: string;
  disabled?: boolean;
  handleOnchange?: (data: any) => void;
  containerClassname?:string;
};

const SelectDropDown = ({
  name,
  control,
  options,
  selected,
  disabled,
  handleOnchange,
  containerClassname
}: DynamicCheckBoxDropDownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
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

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleDropdown();
    }
  };

  return (
    <div  className={cn(
      "relative w-full", // Default styles
      { "max-w-xs": !containerClassname }, // Apply max-w-xs only if no className is provided
      containerClassname // Include custom className if provided
    )} ref={dropdownRef}>
      {/* Dropdown Button */}
      <div
        className={twMerge(
          "flex justify-between items-center border-2 border-gray-300 rounded-[7px] py-1 bg-white  shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none cursor-pointer",
          disabled ? "opacity-0.6 cursor-not-allowed" : ""
        )}
        onClick={() => {
          !disabled && toggleDropdown();
        }}
      >
        <div className="p-2 flex-grow text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap ">
          {selected || "Select option"}
        </div>
        <button
          type="button"
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={twMerge(
            "border-l border-gray-400 px-3 py-2 bg-white",
            disabled ? "opacity-0.6 cursor-not-allowed" : ""
          )}
          ref={buttonRef}
          aria-controls="dropdown-menu"
        >
          <Icon icon="iconamoon:arrow-down-2-light" className="text-gray-500" />
        </button>
      </div>

      {/* Dropdown Menu */}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div
            id="dropdown-menu"
            className={`max-h-[300px] overflow-auto absolute left-0 w-full bg-white shadow-lg rounded-md mt-1 z-10 border border-gray-400 ${
              isOpen && !disabled ? "block" : "hidden"
            }`}
            role="listbox"
            aria-labelledby="dropdown-button"
          >
            {options.map((option) => (
              <label
                key={option?.id}
                className="block text-gray-700 cursor-pointer hover:bg-gray-100 px-3 py-2 focus:bg-blue-100 focus:outline-none"
                tabIndex={0} // Make labels keyboard focusable
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    field.onChange(option);
                    toggleDropdown();
                  }
                }}
                onClick={() => {
                  field.onChange(option);
                  handleOnchange?.(option)
                  toggleDropdown();
                }}
                role="option"
                aria-selected={field?.value?.id === option?.id}
              >
                <Typography as="p" className="  ">
                  {option.label}
                </Typography>
              </label>
            ))}
          </div>
        )}
      />
    </div>
  );
};

export default SelectDropDown;
