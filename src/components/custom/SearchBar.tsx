import { Icon } from "@iconify/react";

const SearchBar = () => {
  return (
    <div className="relative hidden sm:hidden lg:block ">
      <input
        type="text"
        className="  border p-3 pl-10 rounded-[7px] w-full text-base font-normal outline-none bg-gray-50 min-w-[400px]" // Add left padding to accommodate the icon
        placeholder="Type to search..."
      />
      <span className="absolute left-3 top-3">
        <Icon
          icon="circum:search"
          style={{ width: "25px", height: "25px", color: "#00000080" }} // Customize the size and color as needed
        />
      </span>
    </div>
  );
};

export default SearchBar;
