import { EntryType } from "@/types/dashboard";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type AppProps = {
  patientData: any;
};

const PatientStatusPieChart = ({ patientData }: AppProps) => {
  const data = [
    { name: "New", value: +patientData?.result?.new_patients },
    { name: "Returning", value: +patientData?.result?.returning_patients },
  ];
  const COLORS = ["#2260ee", "#81a6fb"];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          innerRadius={50}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data?.map((entry: EntryType, index: number) => {
            console.log(entry);
            return (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            );
          })}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PatientStatusPieChart;
