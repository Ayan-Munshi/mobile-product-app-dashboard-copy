import { useState, useEffect } from "react"; // Import useEffect
import { Icon } from "@iconify/react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useWindowSize } from "@/customHooks/useResizeWindow";
import { navItems } from "@/constant/navItems";

export default function Sidebar() {
  const { width } = useWindowSize(); // use custom hook to get wondow's current width;
  const [isExpanded, setIsExpanded] = useState(width > 1600);

  useEffect(() => {
    setIsExpanded(width > 1600);
  }, [width]); // if window's width will change then we set setIsExpanded value;

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(width > 1600); // isExpanded will be true , false based on the given statement
  };

  return (
    <motion.nav
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{ width: isExpanded ? "210px" : "85px" }} // Adjust width based on isExpanded
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed top-120 left-0 h-full bg-white space-y-[10px] px-3"
      role="navigation"
      aria-expanded={isExpanded}
      aria-label="Sidebar navigation"
    >
      <div
        className="flex items-center justify-start min-h-[60px] w-full pt-[3px]"
        role="img"
        aria-label="Logo"
      >
        <img
          src="https://d22gspqa8b57yo.cloudfront.net/assets/favicon-1.png"
          alt="Logo"
          className="cursor-pointer max-w-[60px]"
        />
      </div>
      {navItems.map(({ label, path, icon, width, weight }) => (
        <NavLink
          key={label}
          to={path}
          className={({ isActive }) =>
            `p-4 flex items-center flex-[100%_0_0] ${
              !isActive ? "hover:bg-gray-100" : ""
            } rounded-[7px] ${isActive ? "text-[#60a5fa] bg-[#5186FF2B]" : ""}`
          }
          role="menuitem"
          tabIndex={0}
        >
          {({ isActive }) => (
            <>
              <div aria-hidden="true">
                <Icon
                  icon={icon}
                  style={{
                    width: width,
                    height: width,
                    fontWeight: weight,
                    color: isActive ? "#60a5fa" : "#000000A6",
                  }}
                />
              </div>
              <div
                className={`ml-2 overflow-hidden menu-text ${
                  isExpanded ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden={!isExpanded}s
              >
                {label}
              </div>
            </>
          )}
        </NavLink>
      ))}
    </motion.nav>
  );
}
