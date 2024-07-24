import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./BrokenLine.css";

const BrokenLine = ({ isCollapsed, top, left, right, toggleSidebar }) => {
  const canvasRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    drawLines(ctx);
  }, [isCollapsed, hovered, clicked]);

  const drawLines = (ctx) => {
    ctx.clearRect(0, 0, 40, 40);
    ctx.beginPath();
    ctx.moveTo(20, 20); // центр
    if (hovered) {
      if (clicked) {
        // Линии ломаются в противоположную сторону после клика
        ctx.lineTo(isCollapsed ? 23 : 17, 5); // верхняя линия
        ctx.moveTo(20, 20); // центр
        ctx.lineTo(isCollapsed ? 23 : 17, 35); // нижняя линия
      } else {
        // Линии ломаются при наведении
        ctx.lineTo(isCollapsed ? 17 : 23, 5); // верхняя линия
        ctx.moveTo(20, 20); // центр
        ctx.lineTo(isCollapsed ? 17 : 23, 35); // нижняя линия
      }
    } else {
      // Линии в исходном положении
      ctx.lineTo(20, 5); // верхняя линия
      ctx.moveTo(20, 20); // центр
      ctx.lineTo(20, 35); // нижняя линия
    }
    ctx.strokeStyle = "#2F3036";
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  const handleMouseOver = () => {
    setHovered(true);
  };

  const handleMouseOut = () => {
    setHovered(false);
    setClicked(false);
  };

  const handleClick = () => {
    setClicked(true);
    toggleSidebar();
  };

  return (
    <canvas
      ref={canvasRef}
      width="40"
      height="40"
      style={{
        background: "transparent",
        position: "fixed",
        top: top,
        left: left,
        right: right,
        transition: "left 0.3s ease",
      }}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={handleClick}
    />
  );
};

BrokenLine.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  top: PropTypes.string,
  left: PropTypes.string,
  right: PropTypes.string,
  toggleSidebar: PropTypes.func.isRequired,
};

export default BrokenLine;
