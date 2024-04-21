import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../services/axios";
import { Tabs, Tab, Button } from "react-bootstrap";
import BuildingDetails from "../components/BuildingDetails";
import AssignUserBuilding from "../components/AssignUserBuilding";
import { Trash } from "react-bootstrap-icons";
import SectionList from "../components/SectionList";

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
          <h4>{`${building.number}, ${building.name}`}</h4>
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
        defaultActiveKey="info"
        id="building-details-tabs"
        style={{ marginBottom: "24px" }}
      >
        <Tab eventKey="info" title="Информация об объекте">
          <BuildingDetails
            building={building}
            handleIsUpdated={handleIsUpdated}
          />
        </Tab>
        <Tab eventKey="pd" title="Проектная документация">
          <SectionList stage={"PD"} buildingId={buildingId} />
        </Tab>
        <Tab eventKey="wd" title="Рабочая документация">
          <SectionList stage={"WD"} buildingId={buildingId} />
        </Tab>
        <Tab eventKey="assign" title="Проектная группа">
          <AssignUserBuilding building={building} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default BuildingPage;
