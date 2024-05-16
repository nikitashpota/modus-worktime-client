import React from "react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

const FinanceComparison = ({ verificationAmount, resultAmount }) => {
  const delta = resultAmount - verificationAmount;
  const deltaColor = delta >= 0 ? "red" : "green";
  const deltaSymbol = delta >= 0 ? "-" : "+";
  return (
    <div
      style={{
        width: "130px",
        padding: "8px",
        backgroundColor: "white",
        borderRadius: "6px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: "55%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div>{(+verificationAmount).toLocaleString()} ₽</div>
      <div>{resultAmount.toLocaleString()} ₽</div>
      <div style={{ color: deltaColor }}>
        {deltaSymbol}
        {Math.abs(delta).toLocaleString()} ₽
      </div>
    </div>
  );
};

const CustomPieChart = ({ verificationAmount, type, data, colors }) => {
  return (
    <div
      style={{
        margin: "10px",
        backgroundColor: "#f8f9fa",
        borderRadius: "6px",
        position: "relative",
      }}
    >
      {verificationAmount && data && (
        <FinanceComparison
          verificationAmount={verificationAmount}
          resultAmount={data.reduce((acc, item) => acc + item.value, 0)}
        />
      )}
      {data ? <h5 style={{ textAlign: "center" }}>{type}</h5> : <></>}
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="200"
          cy="200"
          outerRadius={150}
          innerRadius={100}
          fill="#8884d8"
          // labelLine={false}
          // label={renderCustomizedLabel}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
};

export default CustomPieChart;
