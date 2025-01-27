import { Icon } from "@iconify/react/dist/iconify.js";
import { useRef, useEffect, SetStateAction, Dispatch } from "react";

type AppProps = {
  options: { id: string; name: string }[];
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedProviders: (newValue: { id: string; name: string }[]) => void;
  selectedProviders: { id: string; name: string }[];
  handleProviderAdd: () => void;
  handleCheckUncheckProviderToast: () => void;
};

const AddProviderRow = ({
  options,
  isOpen,
  setIsOpen,
  setSelectedProviders,
  selectedProviders,
  handleProviderAdd,
  handleCheckUncheckProviderToast,
}: AppProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen((prev: boolean) => !prev);
  };

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

  // Handle checkbox selection
  const handleCheckboxChange = (option: { id: string; name: string }) => {
    const isSelected = selectedProviders.some(
      (provider) => provider.id === option.id
    );

    const newValue = isSelected
      ? selectedProviders.filter((provider) => provider.id !== option.id)
      : [...selectedProviders, option];

    setSelectedProviders(newValue);
  };

  return (
    <div className="relative " ref={dropdownRef}>
      <button
        ref={buttonRef}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls="provider-dropdown"
        onClick={toggleDropdown}
        className="flex gap-1 min-w-[281px] items-center justify-between border-[1px] text-center border-gray-400 py-2 pl-4 pr-1 cursor-pointer rounded-md whitespace-nowrap"
      >
        {`${selectedProviders.length}/${options.length} selected`}
        <Icon icon="ri:arrow-drop-down-fill" className="size-8 text-gray-500" />
      </button>

      {isOpen && (
        <div
          id="provider-dropdown"
          className="absolute  right-0 w-full bg-white rounded-b-[12px] shadow-lg rounded-md  z-10 border border-gray-300"
          role="menu"
          aria-labelledby="provider-dropdown-button"
        >
          <div className="h-[150px] overflow-y-auto ">
            <ul className="flex-1">
              {options.map((option: any) => (
                <li className="list-none hover:bg-gray-100 focus:bg-blue-100 cursor-pointer px-4 py-[12px]">
                  <label
                    key={option.id}
                    className="flex items-center cursor-pointer "
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleCheckboxChange(option);
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      className="mr-2"
                      value={option.id}
                      onChange={() =>
                        option?.reason_for_visits?.length
                          ? handleCheckUncheckProviderToast()
                          : handleCheckboxChange(option)
                      }
                      checked={selectedProviders.some(
                        (provider) => provider.id === option.id
                      )}
                      aria-checked={selectedProviders.some(
                        (provider) => provider.id === option.id
                      )}
                    />
                    {/* {option.name} */}
                    {option?.name} {`(${option?.pms_prov_num})`}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#E9E9E9] rounded-b-[12px] flex">
            <button
              onClick={toggleDropdown}
              className=" flex items-center justify-center gap-1 w-1/2 min-h-[43px] border border-gray-300 text-[14px] text-red-800 rounded-bl-[10px] "
            >
              <Icon
                icon="radix-icons:cross-1"
                className="text-red-800 size-4.5"
              />
              Dismiss
            </button>
            <button
              className="flex items-center justify-center gap-2 w-1/2 min-h-[43px] border border-gray-300 text-[14px] text-green-800 rounded-br-[10px]"
              onClick={handleProviderAdd}
            >
              <Icon
                icon="teenyicons:tick-outline"
                className="text-green-800 size-3.5"
              />
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProviderRow;
