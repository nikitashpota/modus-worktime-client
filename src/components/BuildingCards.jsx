import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";

function truncateString(str, num) {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
}

const BuildingCards = ({ buildings, onSelectBuilding }) => {
  return (
    <Row xs={1} md={2} lg={4} className="g-4">
      {buildings.map((building) => (
        <Col key={building.id}>
          <Card style={{ minHeight: "400px" }}>
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
      ))}
    </Row>
  );
};

export default BuildingCards;
