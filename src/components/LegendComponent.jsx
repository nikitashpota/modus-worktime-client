import React from "react";

const LegendComponent = ({ data, colors }) => {
  const calculatePercentage = (data, value) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);
    return ((value / total) * 100).toFixed(2) + "%"; // Округление до двух десятичных знаков и добавление знака процента
  };

  return (
    <div
      style={{
        width: "400px",
        height: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        margin: "10px",
      }}
    >
      {data.map(
        (item, index) =>
          item.value > 0 && (
            <div
              key={index}
              style={{ display: "flex", alignItems: "center", margin: "2px" }}
            >
              <div
                style={{
                  width: "15px",
                  height: "15px",
                  backgroundColor: colors[index % colors.length],
                  marginRight: "10px",
                }}
              ></div>
              <div>
                <div style={{ fontSize: "14px", color: "#333" }}>
                  {item.name}
                </div>
                <div style={{ fontSize: "12px", color: "#333" }}>
                  Размер: {item.value} р.{" "}
                  {`(${calculatePercentage(data, item.value)})`}
                </div>
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default LegendComponent;
