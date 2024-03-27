import React, { useState, useEffect } from "react";
import axios from "../services/axios";
import AddBuildingForm from "../components/AddBuildingForm";
import BuildingList from "../components/BuildingList";
import EditBuildingModal from "../components/EditBuildingModal";
import { useNavigate } from "react-router-dom";

function ManagerView() {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false); // Для триггера обновления списка объектов
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);

  const onSelectBuildingToEdit = (buildingId) => {
    setSelectedBuildingId(buildingId);
    setShowEditModal(true);
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
  }, [isUpdated]); // Обновляем список объектов при изменении isUpdated

  const handleBuildingAdded = () => {
    setIsUpdated((prev) => !prev);
  };

  // Функция для назначения объекта пользователю (вы можете добавить реализацию модального окна или другой логики выбора пользователя здесь)
  const handleSelectUserForBuilding = (buildingId) => {
    // Реализация функции
    navigate(`/assign-user/${buildingId}`);
  };

  const handleBuildingDeleted = async (buildingId) => {
    try {
      await axios.delete(`/buildings/${buildingId}`);
      // Обновляем состояние, чтобы исключить удаленный объект
      setBuildings((prevBuildings) =>
        prevBuildings.filter((b) => b.id !== buildingId)
      );
    } catch (error) {
      console.error("Ошибка при удалении объекта:", error);
      // Обработка ошибок, например, показать сообщение пользователю
    }
  };

  return (
    <div>
      <AddBuildingForm onBuildingAdded={handleBuildingAdded} />
      <BuildingList
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
      />
    </div>
  );
}

export default ManagerView;
