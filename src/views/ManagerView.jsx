import React, { useState, useEffect } from "react";
import axios from "../services/axios";
import AddBuildingForm from "../components/AddBuildingForm";
import BuildingList from "../components/BuildingList";
import EditBuildingModal from "../components/EditBuildingModal";
import { useNavigate } from "react-router-dom";
import BuildingCards from "../components/BuildingCards";

function ManagerView() {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);

  // const onSelectBuildingToEdit = (buildingId) => {
  //   setSelectedBuildingId(buildingId);
  //   setShowEditModal(true);
  // };

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

  // const handleSelectUserForBuilding = (buildingId) => {
  //   navigate(`/assign-user/${buildingId}`);
  // };

  // const handleBuildingDeleted = async (buildingId) => {
  //   try {
  //     await axios.delete(`/buildings/${buildingId}`);
  //     setBuildings((prevBuildings) =>
  //       prevBuildings.filter((b) => b.id !== buildingId)
  //     );
  //   } catch (error) {
  //     console.error("Ошибка при удалении объекта:", error);
  //   }
  // };

  return (
    <div>
      <AddBuildingForm onBuildingAdded={handleBuildingAdded} />
      <BuildingCards
        buildings={buildings}
        onSelectBuilding={handleSelectUserForBuilding} // Используйте эту функцию для навигации
      />
      {/* <BuildingList
        buildings={buildings}
        onSelectUserForBuilding={handleSelectUserForBuilding}
        onBuildingDeleted={handleBuildingDeleted}
        onSelectBuildingToEdit={onSelectBuildingToEdit}
      />

      <EditBuildingModal
        show={showEditModal}
        buildingId={selectedBuildingId}
        handleClose={() => setShowEditModal(false)}
        updateBuildingList={handleBuildingAdded}
      /> */}
    </div>
  );
}

export default ManagerView;
