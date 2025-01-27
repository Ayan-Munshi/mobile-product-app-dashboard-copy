import { Calendar } from "../ui/calendar";

type AppProps = {
  startDate: Date | null;
  endDate: Date | null;
  disabledEndDate?: boolean;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
};
const DateRangePicker = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  disabledEndDate,
}: AppProps) => {
  //   const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <div className="flex gap-4">
      <Calendar
        mode="single"
        selected={startDate || undefined}
        onSelect={(date) => setStartDate(date || null)}
        className="rounded-md border"
      />
      <Calendar
        mode="single"
        selected={endDate || undefined}
        onSelect={(date) => setEndDate(date || null)}
        className="rounded-md border"
        disabled={
          disabledEndDate
            ? (date: any) => {
                const today = new Date();
                // Disable dates greater than today
                return date > today;
              }
            : undefined
        }
      />
    </div>
  );
};

export default DateRangePicker;
