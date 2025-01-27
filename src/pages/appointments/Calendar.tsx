import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "../../lib/utils";
import { buttonVariants } from "@/components/ui/button";

type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  setCurrentMonth?: (month: Date) => void; // Define the type for setCurrentMonth
  availableDates: Date[]; // Available dates as Date objects
};

//*** Main return function

function Calendar({
  className,
  classNames,
  setCurrentMonth,
  availableDates,
  ...props
}: CalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set today to midnight for accurate comparison

  // State to keep track of the selected date
  const [selectedDate, setSelectedDate] = React.useState<any>(today);
  const [currentMonth, setCurrentMonthState] = React.useState<Date>(today); // State for the current month
  // Modifiers: Disable all days before today, Saturdays, and Sundays
  const modifiers = {
    disabled: [
      (date: Date) => date < today, // Disable all previous days
      (date: Date) => date.getDay() === 0 || date.getDay() === 6, // Disable Sundays (0) and Saturdays (6)
      (date: Date) =>
        !availableDates.some(
          (availableDate) =>
            availableDate.getDate() === date.getDate() &&
            availableDate.getMonth() === date.getMonth() &&
            availableDate.getFullYear() === date.getFullYear()
        ), // Disable dates that are NOT in availableDates
    ],
    currentDate: (date: Date) => date.getTime() === today.getTime(), // Mark today
  };

  // Updates the current month state and optionally calls the parent function to update the parent component's state.
  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonthState(newMonth);
    setCurrentMonth?.(newMonth); // Update the parent state if needed
  };

  // Disables the "previous month" button if the current month is the same as today's month.
  const isPrevMonthDisabled =
    currentMonth.getMonth() === today.getMonth() &&
    currentMonth.getFullYear() === today.getFullYear();

  // *** main return

  return (
    <DayPicker
      className={cn("p-3", className)}
      selected={selectedDate}
      onDayClick={(date, modifiers) => {
        if (!modifiers.disabled && date.getTime() !== selectedDate?.getTime()) {
          setSelectedDate(date);
        }
      }}
      onMonthChange={handleMonthChange}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-8 w-full",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          // buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: cn(
          "absolute left-1",
          isPrevMonthDisabled ? "opacity-50 pointer-events-none" : ""
        ), // Disable the previous button when the current month is today or later
        nav_button_next: "absolute right-1", // Ensure the next button is always enabled
        table: "w-full border-collapse space-y-1",
        head_row: "flex justify-between",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex justify-between w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-normal aria-selected:opacity-100 bg-blue-100 hover:bg-button-clr-700/50 hover:text-white rounded-full p-3"
        ),
        day_selected:
          "!bg-button-clr-700 text-white hover:bg-button-clr-700 hover:text-white focus:bg-button-clr-700 focus:text-white",
        day_today: cn(
          "bg-accent text-accent-foreground relative", // Keep existing styles for today
          "after:content-[''] after:absolute after:bottom-[2px] after:left-1/2 after:transform after:-translate-x-1/2 after:h-1.5 after:w-1.5 after:rounded-full", // Base dot style
          selectedDate?.getTime() === today.getTime()
            ? "after:bg-white" // Dot becomes white when today is selected and not disabled
            : "after:bg-black" // Dot remains black when not selected
        ),
        day_outside: "day-outside opacity-0",
        day_disabled: "text-muted-foreground opacity-50 bg-opacity-0",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      modifiers={modifiers}
      components={{
        IconLeft: () => (
          <ChevronLeft
            className={cn("h-4 w-4", isPrevMonthDisabled ? "opacity-0" : "")}
          />
        ),
        IconRight: () => <ChevronRight className="h-4 w-4" />, // Always enabled for future months
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
