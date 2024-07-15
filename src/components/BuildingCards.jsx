import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";

function truncateString(str, num) {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
}

const getStatusStyle = (status) => {
  switch (status) {
    case "active":
      return { color: "green", text: "активный" };
    case "completed":
      return { color: "gray", text: "завершено" };
    case "pending":
      return { color: "#d96004", text: "в ожидании" };
    default:
      return { color: "gray", text: "неизвестно" };
  }
};

const BuildingCards = ({ buildings, onSelectBuilding }) => {
  return (
    <Row xs={1} md={2} lg={4} className="g-4">
      {buildings.map((building) => {
        const statusStyle = getStatusStyle(building.status);
        return (
          <Col key={building.id}>
            <Card style={{ minHeight: "400px", position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  display: "flex",
                  alignItems: "baseline",
                  gap: "8px",
                  zIndex: 1,
                  // border: `1px solid ${statusStyle.color}`,
                  // borderRadius: "4px",
                  // padding: "4px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: statusStyle.color,
                    boxShadow: `0 0 4px ${statusStyle.color}`,
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
              </div>
              <Card.Img
                variant="top"
                src="/building-img.webp"
                style={{
                  maxHeight: "150px",
                  objectFit: "contain",
                  opacity: 0.5,
                }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{truncateString(building.name, 40)}</Card.Title>
                <Card.Text
                  className="flex-grow-1"
                  style={{
                    overflow: "hidden",
                    wordWrap: "break-word",
                    maxHeight: "120px",
                  }}
                >
                  {truncateString(building.description, 500)}
                </Card.Text>
                <Button
                  variant="outline-primary"
                  className="mt-auto"
                  onClick={() => onSelectBuilding(building.id)}
                >
                  Перейти к объекту
                </Button>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default BuildingCards;
