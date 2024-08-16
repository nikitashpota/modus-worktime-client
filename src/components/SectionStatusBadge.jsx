import React from "react";
import { statuses } from "../services/statuses";

const getStatusStyle = (status) => {
  const statusInfo = statuses[status] || {};
  return { color: statusInfo.color || "red", text: statusInfo.ru || "Не выпущен" };
};

const SectionStatusBadge = ({ status, position }) => {
  const statusStyle = getStatusStyle(status);
  const { top, left, right, bottom } = position;

  return (
    <div
      style={{
        // position: "absolute",
        // top: top ? top : "auto",
        // left: left ? left : "auto",
        // right: right ? right : "auto",
        // bottom: bottom ? bottom : "auto",
        display: "flex",
        alignItems: "baseline",
        gap: "8px",
        zIndex: 1,
      }}
    >
      <div
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: statusStyle.color,
          boxShadow: `0 0 4px gray`,
          animation: "pulse 1.5s infinite",
        }}
      ></div>
      <span
        style={{
          color: statusStyle.color,
          fontWeight: "400",
          fontSize: "12px",
        }}
      >
        {statusStyle.text}
      </span>
      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 4px gray;
          }
          50% {
            box-shadow: 0 0 8px gray;
          }
          100% {
            box-shadow: 0 0 4px gray;
          }
        }
      `}</style>
    </div>
  );
};

export default SectionStatusBadge;
