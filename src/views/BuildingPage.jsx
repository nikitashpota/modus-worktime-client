import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../services/axios";
import { Tabs, Tab, Button } from "react-bootstrap";
import BuildingDetails from "../components/BuildingDetails";
// import AssignUserBuilding from "../components/AssignUserBuilding";
import { Trash } from "react-bootstrap-icons";
import SectionList from "../components/SectionList";
import ProjectTimeline from "../components/ProjectTimeline";

const BuildingPage = () => {
  const { buildingId } = useParams();
  const [building, setBuilding] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  const handleSelect = (key) => {
    setActiveTab(key);
  };

  const handleIsUpdated = () => {
    setIsUpdated(!isUpdated);
  };

  useEffect(() => {
    console.log("buildingId", buildingId);
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
        activeKey={activeTab}
        onSelect={handleSelect}
      >
        <Tab eventKey="info" title="Информация об объекте">
          <BuildingDetails
            building={building}
            handleIsUpdated={handleIsUpdated}
          />
        </Tab>
        <Tab eventKey="timeline" title="График проектирования">
          <ProjectTimeline buildingId={buildingId} activeTab={activeTab} />
        </Tab>
        <Tab eventKey="pd" title="Проектная документация">
          <SectionList stage={"ПД"} buildingId={buildingId} />
        </Tab>
        <Tab eventKey="wd" title="Рабочая документация">
          <SectionList stage={"РД"} buildingId={buildingId} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default BuildingPage;
