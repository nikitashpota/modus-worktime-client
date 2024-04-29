import React, { useEffect, useRef, useState } from "react";
import Milestone from "./Milestone";

const TimelineChart = ({ milestones, lineColor, milestoneColor }) => {
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const padding = 30;

  const handleMouseEnter = (data) => {
    setTooltip(data);
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Отфильтровываем вехи без дат и сортируем по дате
  const sortedMilestones = milestones
    .filter((m) => m && m.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (!sortedMilestones.length) {
    return (
      <div ref={containerRef} style={{ width: "100%", height: "50px" }}>
        Нет данных для отображения
      </div>
    );
  }

  const startDate = new Date(sortedMilestones[0].date);
  const endDate = new Date(sortedMilestones[sortedMilestones.length - 1].date);
  const totalDuration = endDate - startDate;

  if (!containerWidth) {
    return (
      <div ref={containerRef} style={{ width: "100%", height: "50px" }}>
        Загрузка...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", marginBottom: "20px", position: "relative" }}
    >
      <svg width="100%" height="100px">
        <line
          x1={padding}
          y1="75"
          x2={containerWidth - padding}
          y2="75"
          stroke={lineColor}
          strokeWidth="8"
        />
        {sortedMilestones.map((milestone, index) => {
          const position =
            padding +
            ((new Date(milestone.date) - startDate) / totalDuration) *
              (containerWidth - 2 * padding);
          return (
            <Milestone
              key={index}
              date={new Date(milestone.date)}
              code={milestone.code}
              position={position}
              color={milestoneColor}
              isFirst={
                startDate.getTime() === new Date(milestone.date).getTime()
                  ? true
                  : false
              }
              isLast={
                endDate.getTime() === new Date(milestone.date).getTime()
                  ? true
                  : false
              }
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          );
        })}
      </svg>
      {tooltip && (
        <div
          style={{
            position: "absolute",
            left: tooltip.isLast ? `${tooltip.position - 130}px` : `${tooltip.position - 10}px`,
            border: "1px solid black",
            backgroundColor: "white",
            padding: "5px",
            borderRadius: "5px",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
          }}
        >
          {tooltip.date.toLocaleDateString()} - {tooltip.code}
        </div>
      )}
    </div>
  );
};

export default TimelineChart;
