import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../services/axios";
import { Tabs, Tab, Button, Badge } from "react-bootstrap";
import BuildingDetails from "../components/BuildingDetails";
import { Trash } from "react-bootstrap-icons";
import SectionList from "../components/SectionList";
import BuildingTimeline from "../components/BuildingTimeline";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import SubcontractorList from "../components/SubcontractorList";
import { useAuth } from "../services/AuthContext";

const BuildingPage = () => {
  const { userRole } = useAuth();
  const { buildingId } = useParams();
  const [building, setBuilding] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const navigate = useNavigate();

  const handleSelect = (key) => {
    setActiveTab(key);
  };

  const handleIsUpdated = () => {
    setIsUpdated(!isUpdated);
  };

  const handleDeleteBuilding = async (buildingId) => {
    try {
      const response = await axios.delete(`/buildings/${buildingId}`);
      console.log("Building deleted:", response.data);
      navigate("/building");
    } catch (error) {
      console.error(
        "Error deleting building:",
        error.response?.data || error.message
      );
    }
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
          <h3>
            <Badge style={{ marginRight: "16px" }}>{building.number}</Badge>
            {building.name}
          </h3>
          <Button
            variant="outline-danger"
            onClick={() => setShowConfirmModal(true)}
            style={{
              display: userRole === "Проектировщик" ? "none" : "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Trash />
            Удалить
          </Button>

          {showConfirmModal && (
            <ConfirmDeleteModal
              show={showConfirmModal}
              handleClose={() => setShowConfirmModal(false)}
              buildingNumber={building.number}
              onConfirm={() => handleDeleteBuilding(buildingId)}
            />
          )}
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
          <BuildingTimeline buildingId={buildingId} activeTab={activeTab} />
        </Tab>
        <Tab
          eventKey="pd"
          title="Проектная документация"
          disabled={userRole === "Проектировщик" ? true : false}
        >
          <SectionList stage={"ПД"} buildingId={buildingId} />
        </Tab>
        <Tab
          eventKey="wd"
          title="Рабочая документация"
          disabled={userRole === "Проектировщик" ? true : false}
        >
          <SectionList stage={"РД"} buildingId={buildingId} />
        </Tab>
        <Tab
          eventKey="-"
          title="Прочие работы"
          disabled={userRole === "Проектировщик" ? true : false}
        >
          <SectionList stage={"-"} buildingId={buildingId} />
        </Tab>
        <Tab
          eventKey="subcontractors"
          title="Субподрядные организации"
          disabled={userRole === "Проектировщик" ? true : false}
        >
          <SubcontractorList buildingId={buildingId} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default BuildingPage;
