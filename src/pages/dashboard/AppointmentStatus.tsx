import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppointmentDataType } from ".";

//*** Main return function's props type
type AppProps = {
  data: AppointmentDataType[];
};

//*** Main return function
const AppointmentStatus = ({ data }: AppProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 10,
          bottom: 10,
        }}
      >
        {/* Define gradient */}
        <defs>
          <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#88a0df" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#f1f4f9" stopOpacity={0.3} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="Appointment"
          stroke="#6c95f3" // Solid stroke color
          fill="url(#blueGradient)" // Reference gradient for fill
          strokeWidth={1}
          dot={{
            stroke: "#6c95f3",
            strokeWidth: 2,
            fill: "#88a0df",
          }}
          activeDot={{
            r: 6,
            fill: "#6c95f3",
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AppointmentStatus;
