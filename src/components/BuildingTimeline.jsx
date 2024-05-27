import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import MilestoneForm from "./MilestoneForm";
import axios from "../services/axios";
import UserSelector from "./UserSelector";
import TimelineChart from "./TimelineChart";
import { useAuth } from "../services/AuthContext";
import { PlusCircle, DashCircle } from "react-bootstrap-icons";
import "./TimeTable.css";

const BuildingTimeline = ({ buildingId, activeTab }) => {
  const [milestones, setMilestones] = useState([]);
  const [maxMilestone, setMaxMilestone] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [workTimeLogs, setWorkTimeLogs] = useState([]);
  const [update, setUpdate] = useState(false);
  const [scale, setScale] = useState(100);
  const [userName, setUserName] = useState("");
  const [showOnlyCertified, setShowOnlyCertified] = useState(false);

  const { userId } = useAuth();

  const handleScaleChange = (increment) => {
    setScale((prev) => {
      const newScale = prev + increment;
      return newScale < 100 ? 100 : newScale > 500 ? 500 : newScale;
    });
  };

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`/users/user/${userId}`);
          setUserName(`${response.data.lastName} ${response.data.firstName}`);
        } catch (error) {
          console.error("Ошибка при загрузке данных профиля:", error);
        }
      };

      fetchData();
    }
  }, [userId]);

  useEffect(() => {
    fetchMilestones();
  }, [buildingId, showOnlyCertified]);

  useEffect(() => {
    const fetchWorkTimeLogs = async () => {
      if (selectedUsers.length > 0) {
        try {
          const { data } = await axios.get(
            `/workTimeLogs/building/${buildingId}?users=${selectedUsers.join(
              ","
            )}`
          );
          setWorkTimeLogs(data);
          setUpdate(!update);
        } catch (error) {
          console.error("Error fetching work time logs:", error);
          setWorkTimeLogs([]);
          setUpdate(!update);
        }
      } else {
        setWorkTimeLogs([]);
        setUpdate(!update);
      }
    };
    fetchWorkTimeLogs();
  }, [selectedUsers, buildingId]);

  const fetchMilestones = async () => {
    try {
      const response = await axios.get(`/milestones/${buildingId}`);
      const milestonesData = response.data;

      const filteredData = showOnlyCertified
        ? milestonesData.filter((milestone) => milestone.isCertified)
        : milestonesData;

      setMaxMilestone(getMaxDateMilestone(filteredData));
      setMilestones(
        filteredData.sort((a, b) => new Date(a.date) - new Date(b.date))
      );
    } catch (error) {
      console.error("Error fetching milestones:", error);
      setMilestones([]);
    }
  };

  const handleToggleShowCertified = () => {
    console.log("showOnlyCertified", showOnlyCertified);
    setShowOnlyCertified((prev) => {
      return !prev;
    });
  };

  function getMaxDateMilestone(milestonesData) {
    let maxDate = new Date(0); // начальное значение - самая ранняя возможная дата
    let maxFields = [];

    // Первый проход определяет максимальную дату
    milestonesData.forEach((milestone) => {
      const currentInitialDate = new Date(milestone.initialDate);
      const currentDate = new Date(milestone.date);
      const currentUpdatedDate = new Date(milestone.updatedDate);

      maxDate = new Date(
        Math.max(maxDate, currentInitialDate, currentDate, currentUpdatedDate)
      );
    });

    // Второй проход собирает все типы, которые имеют максимальную дату
    milestonesData.forEach((milestone) => {
      const currentInitialDate = new Date(milestone.initialDate);
      const currentDate = new Date(milestone.date);
      const currentUpdatedDate = new Date(milestone.updatedDate);

      if (
        currentInitialDate.getTime() === maxDate.getTime() &&
        !maxFields.includes("InitialDate")
      ) {
        maxFields.push("InitialDate");
      }
      if (
        currentDate.getTime() === maxDate.getTime() &&
        !maxFields.includes("AmendedDate")
      ) {
        maxFields.push("AmendedDate");
      }
      if (
        currentUpdatedDate.getTime() === maxDate.getTime() &&
        !maxFields.includes("ActualDate")
      ) {
        maxFields.push("ActualDate");
      }
    });

    const maxDateString = maxDate.toISOString().split("T")[0];

    return {
      name: "Empty",
      initialDate: maxDateString,
      date: maxDateString,
      updatedDate: maxDateString,
      documentUrl: null,
      code: "",
      status: "",
      id: `max-${Date.now()}`,
      type: maxFields.join(", "), // Соединяем все типы, имеющие максимальную дату
    };
  }

  const handleDateChange = async (id, updateData) => {
    console.log(updateData);
    try {
      await axios.put(`/milestones/${id}`, updateData);
      fetchMilestones();
    } catch (error) {
      console.error("Error updating milestone:", error);
    }
  };

  const handleDeleteMilestone = async (id) => {
    try {
      await axios.delete(`/milestones/${id}`);
      fetchMilestones();
    } catch (error) {
      console.error("Error deleting milestone:", error);
    }
  };

  const handleAddMilestone = async (name, code, initialDate) => {
    const newMilestone = {
      buildingId,
      name,
      code,
      initialDate,
      date: initialDate,
      updatedDate: initialDate,
      status: "Активный",
    };

    try {
      await axios.post(`/milestones`, newMilestone);
      console.log("newMilestone", newMilestone);
      fetchMilestones();
    } catch (error) {
      console.error("Ошибка при добавлении вехи:", error);
    }
  };

  const handleToggleCertification = async (milestone) => {
    try {
      console.log("handleToggleCertification", milestone);
      await axios.patch(`/milestones/${milestone.id}/certify`, {
        isCertified: !milestone.isCertified,
      });
      fetchMilestones();
    } catch (error) {
      console.error("Ошибка при изменении статуса актирования:", error);
    }
  };

  return (
    <>
      {activeTab === "timeline" && (
        <>
          <div style={{ zIndex: 100 }}>
            <UserSelector
              buildingId={buildingId}
              onSelectedUsersChange={setSelectedUsers}
            />
          </div>

          <div
            className="table-responsive"
            style={{
              overflowX: "auto",
              overflowY: "hidden",
              width: "100%",
            }}
          >
            <div
              style={{
                margin: "16px 0",
                backgroundColor: "#f8f9fa",
                borderRadius: "6px",
                padding: "8px",
                width: `${scale}%`,
                minWidth: "100%",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    height: "100px",
                    width: "30px",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "rotate(-90deg) translateX(-15px)",
                    transformOrigin: "center",
                    textWrap: "nowrap",
                    color: "#0a58ca",
                    fontSize: "14px",
                  }}
                >
                  Факт. дата
                </div>
                <TimelineChart
                  milestones={[...milestones, maxMilestone]}
                  workTimeLogs={workTimeLogs}
                  update={update}
                  typeDate={"ActualDate"}
                  colorLine="#D92211"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    height: "100px",
                    width: "30px",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "rotate(-90deg) translateX(-15px)",
                    transformOrigin: "center",
                    textWrap: "nowrap",
                    color: "#0a58ca",
                    fontSize: "14px",
                  }}
                >
                  Доп. дата
                </div>
                <TimelineChart
                  milestones={[...milestones, maxMilestone]}
                  colorLine="#F2BC1B"
                  typeDate={"AmendedDate"}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    height: "100px",
                    width: "30px",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "rotate(-90deg) translateX(-15px)",
                    transformOrigin: "center",
                    textWrap: "nowrap",
                    color: "#0a58ca",
                    fontSize: "14px",
                  }}
                >
                  Исх. дата
                </div>
                <TimelineChart
                  milestones={[...milestones, maxMilestone]}
                  colorLine="#15BFBF"
                  typeDate={"InitialDate"}
                />
              </div>
            </div>
          </div>
          <div
            className="d-flex justify-content-md-end"
            style={{ gap: "6px", margin: "8px 0" }}
          >
            <Form.Control
              readOnly
              style={{ width: "80px", textAlign: "center" }}
              value={`${scale}%`}
            />
            <Button
              onClick={() => handleScaleChange(-50)}
              variant="outline-secondary"
            >
              <DashCircle size={24} />
            </Button>
            <Button
              onClick={() => handleScaleChange(50)}
              variant="outline-secondary"
            >
              <PlusCircle size={24} />
            </Button>
          </div>

          <MilestoneForm
            milestones={milestones}
            onUpdateMilestone={handleDateChange}
            onDeleteMilestone={handleDeleteMilestone}
            onAddMilestone={handleAddMilestone}
            userName={userName}
            handleToggleCertification={handleToggleCertification}
            handleToggleShowCertified={handleToggleShowCertified}
            showOnlyCertified={showOnlyCertified}
            fetchMilestones={fetchMilestones}
          />
        </>
      )}
    </>
  );
};

export default BuildingTimeline;
