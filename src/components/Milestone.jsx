import React, { useState, Fragment } from "react";

const Milestone = ({
  date,
  code,
  position,
  isFirst,
  isLast,
  color,
  onMouseEnter,
  onMouseLeave,
}) => {
  // const [showTooltip, setShowTooltip] = useState(false);

  // // Форматирование даты для отображения
  // const formattedDate = new Date(date).toLocaleDateString();

  // const handleMouseEnter = () => {
  //   setShowTooltip(true);
  // };

  // const handleMouseLeave = () => {
  //   setShowTooltip(false);
  // };

  const textAnchor = isFirst ? "start" : isLast ? "end" : "middle";

  return (
    <Fragment>
      {isFirst || isLast ? (
        <circle
          cx={position}
          cy="75"
          r="10"
          fill={color}
          onMouseEnter={() => onMouseEnter({ date, code, position, isLast })}
          onMouseLeave={onMouseLeave}
        />
      ) : (
        <rect
          x={position - 5}
          y="65"
          width="10"
          height="20"
          rx="2"
          fill={color}
          onMouseEnter={() => onMouseEnter({ date, code, position, isLast })}
          onMouseLeave={onMouseLeave}
        />
      )}
      <text
        x={position}
        y="40"
        fill="black"
        fontSize="16"
        textAnchor={textAnchor}
        alignmentBaseline="central"
      >
        {code}
      </text>
      {/* {showTooltip && (
        <foreignObject
          x={position - 50}
          y="0"
          width="100"
          height="60"
          style={{ overflow: "visible" }}
        >
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              border: "1px solid gray",
              backgroundColor: "white",
              padding: "5px",
              borderRadius: "5px",
              textAlign: "center",
              boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
              position: "relative",
              zIndex: 1000, // Этот стиль не всегда работает в SVG, но может помочь в некоторых случаях
            }}
          >
            {`${formattedDate}\n${code}`}
          </div>
        </foreignObject>
      )} */}
    </Fragment>
  );
};

export default Milestone;
