import React, { useState, FC } from "react";

interface RowData {
  name: string;
  age: number;
  occupation: string;
}

interface TableWithAccordionProps {
  data: RowData[];
}

const TableWithAccordion: FC<TableWithAccordionProps> = ({ data }) => {
  const [openRow, setOpenRow] = useState<number | null>(null);

  const toggleRow = (index: number) => {
    setOpenRow(openRow === index ? null : index);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Occupation</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <React.Fragment key={index}>
            <tr onClick={() => toggleRow(index)}>
              <td>{row.name}</td>
              <td>{row.age}</td>
              <td>{row.occupation}</td>
            </tr>
            {openRow === index && (
              <tr>
                <td colSpan={3}>
                  <div
                    style={{
                      background: "#f0f0f0",
                      padding: "10px",
                      marginTop: "-1px",
                      width: "100%",
                    }}
                  >
                    <p>Here is some accordion content for {row.name}!</p>
                    {/* Add any custom content that doesn't follow column rules */}
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default TableWithAccordion;
