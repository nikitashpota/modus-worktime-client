import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import axios from "../services/axios";

const FinancialBuildingList = ({ onSelect }) => {
  const [buildings, setBuildings] = useState([]);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await axios.get("/buildings");

        const filterBuildings = response.data.filter((b) => {
          return b.name !== "Общие работы";
        });
        setBuildings(filterBuildings);
      } catch (error) {
        console.error("Ошибка при загрузке объектов:", error);
      }
    };
    fetchBuildings();
    console.log(buildings);
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      {buildings.map((building) => (
        <Card
          key={building.id}
          style={{
            maxWidth: "350px",
            height: "75px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Card.Body
            style={{ display: "flex", flexDirection: "column", flex: 1 }}
          >
            <Card.Title style={{ fontWeight: "500", fontSize: "14px" }}>
              {building.number}
            </Card.Title>
            <Card.Text>{building.name}</Card.Text>
          </Card.Body>
          <Button
            variant="outline-primary"
            onClick={() => onSelect(building)}
            style={{ marginRight: "10px" }}
          >
            Выбрать
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default FinancialBuildingList;
