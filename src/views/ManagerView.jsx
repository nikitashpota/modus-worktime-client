import React, { useState, useEffect } from "react";
import axios from "../services/axios";
import AddBuildingForm from "../components/AddBuildingForm";
import { useNavigate } from "react-router-dom";
import BuildingCards from "../components/BuildingCards";
import { Form, Row, Col } from "react-bootstrap";

function ManagerView() {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([]);
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const [filter, setFilter] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);

  const handleSelectUserForBuilding = (buildingId) => {
    navigate(`/building/${buildingId}`);
  };

  const fetchObjects = async () => {
    try {
      const response = await axios.get("/buildings");
      setBuildings(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке объектов:", error);
    }
  };

  useEffect(() => {
    fetchObjects();
  }, [isUpdated]);

  useEffect(() => {
    setFilteredBuildings(
      buildings.filter((building) =>
        building.name.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [filter, buildings]);

  const handleBuildingAdded = () => {
    setIsUpdated((prev) => !prev);
  };

  return (
    <div>
      <AddBuildingForm onBuildingAdded={handleBuildingAdded} />
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "4px",
          borderRadius: "4px",
          marginBottom: "16px",
        }}
      >
        <Row className="align-items-center">
          <Col xs="auto">
            <span>Фильтровать по наименованию:</span>
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Введите наименование"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </Col>
        </Row>
      </div>

      <BuildingCards
        buildings={filteredBuildings}
        onSelectBuilding={handleSelectUserForBuilding}
      />
    </div>
  );
}

export default ManagerView;
