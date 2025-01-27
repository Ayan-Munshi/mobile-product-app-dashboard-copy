import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useRef, useEffect } from "react";
import { Controller, Control } from "react-hook-form";
import { twMerge } from "tailwind-merge";

// TypeScript interface for form values
interface DynamicCheckBoxDropDownProps {
  name: string;
  control: Control<any>;
  options: DropDownType[];
  label: string;
  requiredMessage?: string;
  required?: boolean;
  handleOnchange?: (data: any) => void;
  handleCheckUncheckOperatoriesToast?: () => void;
  formData?: any;
  disabled?:boolean;
}

type DropDownType = {
  id: number | string;
  label: string;
};

const DynamicCheckBoxDropDown = ({
  name,
  control,
  options,
  label,
  required,
  requiredMessage,
  handleOnchange,
  formData,
  handleCheckUncheckOperatoriesToast,
  disabled
}: DynamicCheckBoxDropDownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
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

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative mt-[0px]" ref={dropdownRef}>
      <div
         onClick={() => {
          !disabled && toggleDropdown();
        }}
        className={twMerge("flex justify-between items-center border-2 text-center border-gray-200 rounded-[7px] cursor-pointer",disabled ? "opacity-0.6 cursor-not-allowed" : "")}
      >
        <div className="p-3">{label}</div>
        <button
          type="button"
          disabled={disabled}
          aria-haspopup="true"
          aria-expanded={isOpen}
          className={twMerge("border-gray-200 border-l-[1px] flex justify-center items-center p-4",disabled ? "opacity-0.6 cursor-not-allowed" : "")}
          ref={buttonRef}
        >
          <Icon icon="iconamoon:arrow-down-2-light" />
        </button>
      </div>
      <Controller
        name={name}
        control={control}
        rules={
          required
            ? {
                validate: (value) =>
                  (value && value.length > 0) || requiredMessage,
              }
            : undefined
        }
        render={({ field }) => (
          <div
            className={`max-h-[300px] overflow-auto absolute left-0 w-full bg-white shadow-lg rounded-md mt-1 z-10 border border-gray-300 ${
              !disabled&&isOpen ? "block" : "hidden"
            }`}
            role="menu"
            aria-labelledby="dropdown-button"
          >
            {/* Search Input Field */}
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none"
            />
            {filteredOptions?.map((option) => (
              <label
                key={option.id}
                className="flex items-center cursor-pointer hover:bg-gray-100 px-3 py-3 focus:bg-blue-100"
              >
                <input
                  type="checkbox"
                  className="mr-2"
                  value={option.id}
                  onChange={() => {
                    const filterOperatories = formData?.operatories?.filter(
                      (operatorie: any) =>
                        operatorie?.operatory_id === option.id
                    );

                    if (
                      filterOperatories?.[0]?.rfvs?.length &&
                      handleCheckUncheckOperatoriesToast
                    ) {
                      handleCheckUncheckOperatoriesToast?.();
                    } else {
                      const isChecked = field.value.includes(option.id);
                      const newValue = isChecked
                        ? field.value.filter(
                            (item: string | number) => item !== option.id
                          )
                        : [...field.value, option.id];

                      handleOnchange?.(newValue);
                      field.onChange(newValue);
                    }
                  }}
                  checked={field.value.includes(option.id)}
                  aria-checked={field.value.includes(option.id)}
                />
                <h5>{option.label}</h5>
              </label>
            ))}
          </div>
        )}
      />
    </div>
  );
};

export default DynamicCheckBoxDropDown;
