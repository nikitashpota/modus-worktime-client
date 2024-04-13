import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../services/axios";
import { Tabs, Tab, Button } from "react-bootstrap";
import BuildingDetails from "../components/BuildingDetails";
import AssignUserBuilding from "../components/AssignUserBuilding";
import { Trash } from "react-bootstrap-icons";

const BuildingPage = () => {
  const { buildingId } = useParams();
  const [building, setBuilding] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);

  const handleIsUpdated = () => {
    setIsUpdated(!isUpdated);
  };

  useEffect(() => {
    const fetchBuilding = async () => {
      try {
        const response = await axios.get(`/buildings/${buildingId}`);
        setBuilding(response.data);
      } catch (error) {
        console.error("Ошибка при получении данных о здании:", error);
      }
    };

    fetchBuilding();
  }, [isUpdated]);

  if (!building) {
    return <div>Загрузка данных о здании...</div>;
  }

  return (
    <div>
      {building && (
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            flexWrap: "nowrap",
            justifyContent: "space-between",
          }}
        >
          <h4>{`Объект: ${building.number} - ${building.name}`}</h4>
          <Button
            variant="outline-danger"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Trash />
            Удалить
          </Button>
        </div>
      )}
      <Tabs
        defaultActiveKey="tep"
        id="building-details-tabs"
        style={{ marginBottom: "24px" }}
      >
        <Tab eventKey="tep" title="Основные свойства">
          <BuildingDetails
            building={building}
            handleIsUpdated={handleIsUpdated}
          />
        </Tab>
        <Tab eventKey="assign" title="Проектная группа">
          <AssignUserBuilding building={building} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default BuildingPage;
