import React, { useState, useEffect } from "react";
import MilestoneForm from "./MilestoneForm";
import TimelineChart from "./TimelineChart";
import axios from "../services/axios";
import milestonesData from "../services/milestonesData";

const ProjectTimeline = ({ buildingId, activeTab }) => {
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    try {
      // Подставляем buildingId в URL для получения вех для конкретного здания
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

  const handleDateChange = async (id, field, value) => {
    try {
      const updatedField = { [field]: value };
      await axios.put(`/milestones/${id}`, updatedField);
      fetchMilestones(); // Обновление списка вех после изменения
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
        buildingId, // Убедитесь, что это поле передается в запросе
        name: milestonesData[0].label,
        code: milestonesData[0].code,
        date: new Date().toISOString().slice(0, 10), // форматирование даты для корректного сохранения
      };
      try {
        const response = await axios.post(`/milestones`, newMilestone);
        setMilestones([...milestones, response.data]); // Обновление состояния после добавления
      } catch (error) {
        console.error("Error adding milestone:", error);
      }
    }
  };

  return (
    <>
      {activeTab === "timeline" && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <TimelineChart
              milestones={milestones}
              lineColor={"#85b8ff"}
              milestoneColor={"#4b81cc"}
            />
            <TimelineChart
              milestones={milestones}
              lineColor={"#6cf093"}
              milestoneColor={"#38d968"}
            />
          </div>
          <MilestoneForm
            milestones={milestones}
            onDateChange={handleDateChange}
            onDeleteMilestone={handleDeleteMilestone}
            onAddMilestone={handleAddMilestone}
          />
        </>
      )}
    </>
  );
};

export default ProjectTimeline;
