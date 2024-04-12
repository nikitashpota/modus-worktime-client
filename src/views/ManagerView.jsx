import React, { useState, useEffect } from "react";
import axios from "../services/axios";
import AddBuildingForm from "../components/AddBuildingForm";
import { useNavigate } from "react-router-dom";
import BuildingCards from "../components/BuildingCards";

function ManagerView() {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);

  const handleSelectUserForBuilding = (buildingId) => {
    navigate(`/building/${buildingId}`);
  };

  const fetchObjects = async () => {
    try {
      const response = await axios.get("/buildings");
      setBuildings(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке объектов:", error);
    }
  };

  useEffect(() => {
    fetchObjects();
  }, [isUpdated]);

  const handleBuildingAdded = () => {
    setIsUpdated((prev) => !prev);
  };

  return (
    <div>
      <AddBuildingForm onBuildingAdded={handleBuildingAdded} />
      <BuildingCards
        buildings={buildings}
        onSelectBuilding={handleSelectUserForBuilding}
      />
    </div>
  );
}

export default ManagerView;
