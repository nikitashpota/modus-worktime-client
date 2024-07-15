import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../services/axios";
import { Tabs, Tab, Button, Badge, Dropdown } from "react-bootstrap";
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

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(`/buildings/${buildingId}/status`, { status: newStatus });
      setBuilding((prev) => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error("Ошибка при изменении статуса здания:", error);
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

  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
        return { color: "green", text: "Активный" };
      case "completed":
        return { color: "gray", text: "Завершено" };
      case "pending":
        return { color: "yellow", text: "В ожидании" };
      default:
        return { color: "gray", text: "Неизвестно" };
    }
  };

  if (!building) {
    return <div>Загрузка данных о здании...</div>;
  }

  const statusStyle = getStatusStyle(building.status);

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
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-secondary"
                id="dropdown-status-toggle"
                style={{ height: "38px", display: "flex", alignItems: "center", gap: "5px" }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: statusStyle.color,
                    boxShadow: `0 0 4px ${statusStyle.color}`,
                  }}
                ></div>
                <span style={{ color: statusStyle.color, fontWeight: "normal", fontSize: "16px" }}>
                  {statusStyle.text}
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleStatusChange("active")}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "green",
                        boxShadow: `0 0 4px green`,
                      }}
                    ></div>
                    <span style={{ color: "green", fontWeight: "normal", fontSize: "16px" }}>
                      Активный
                    </span>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleStatusChange("completed")}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "gray",
                        boxShadow: `0 0 4px gray`,
                      }}
                    ></div>
                    <span style={{ color: "gray", fontWeight: "normal", fontSize: "16px" }}>
                      Завершено
                    </span>
                  </div>
                </Dropdown.Item>
                {/* <Dropdown.Item onClick={() => handleStatusChange("pending")}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "yellow",
                        boxShadow: `0 0 4px yellow`,
                      }}
                    ></div>
                    <span style={{ color: "yellow", fontWeight: "normal", fontSize: "16px" }}>
                      В ожидании
                    </span>
                  </div>
                </Dropdown.Item> */}
              </Dropdown.Menu>
            </Dropdown>
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
          </div>
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
