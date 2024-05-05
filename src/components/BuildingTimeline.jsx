import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import MilestoneForm from "./MilestoneForm";
import axios from "../services/axios";
import milestonesData from "../services/milestonesData";
import UserSelector from "./UserSelector";
import TimelineChart from "./TimelineChart";
import { useAuth } from "../services/AuthContext";
import { PlusCircle, DashCircle } from "react-bootstrap-icons";
import "./TimeTable.css";

const BuildingTimeline = ({ buildingId, activeTab }) => {
  const [milestones, setMilestones] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [workTimeLogs, setWorkTimeLogs] = useState([]);
  const [update, setUpdate] = useState(false);
  const [scale, setScale] = useState(100);
  const [userName, setUserName] = useState("");

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
  }, []);

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
      if (Array.isArray(response.data)) {
        setMilestones(response.data);
      } else {
        console.error(
          "Expected an array of milestones, but received:",
          response.data
        );
        setMilestones([]);
      }
    } catch (error) {
      console.error("Error fetching milestones:", error);
      setMilestones([]);
    }
  };

  const handleDateChange = async (id, updateData) => {
    console.log("Updating milestone:", id, updateData);
    try {
      await axios.put(`/milestones/${id}`, updateData);
      fetchMilestones(); // Перезагрузка данных после обновления
    } catch (error) {
      console.error("Error updating milestone:", error);
    }
  };

  const handleDeleteMilestone = async (id) => {
    try {
      await axios.delete(`/milestones/${id}`);
      fetchMilestones(); // Повторно загружаем список вех после удаления
    } catch (error) {
      console.error("Error deleting milestone:", error);
    }
  };

  const handleAddMilestone = async () => {
    if (buildingId) {
      const newMilestone = {
        buildingId,
        name: milestonesData[0].label,
        code: milestonesData[0].code,
        date: new Date().toISOString().slice(0, 10),
        updatedDate: new Date().toISOString().slice(0, 10),
      };
      console.log(newMilestone);
      try {
        const response = await axios.post(`/milestones`, newMilestone);
        setMilestones([...milestones, response.data]);
      } catch (error) {
        console.error("Error adding milestone:", error);
      }
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
              <TimelineChart
                milestones={milestones}
                workTimeLogs={workTimeLogs}
                update={update}
                isActualUpdate={false}
              />
              <TimelineChart
                milestones={milestones}
                colorLine="#FF421C"
                isActualUpdate={true}
              />
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
          />
        </>
      )}
    </>
  );
};

export default BuildingTimeline;
