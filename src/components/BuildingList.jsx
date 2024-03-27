import React, { useState } from "react";
import { ListGroup, Button, Modal } from "react-bootstrap";

function BuildingList({
  buildings,
  onSelectUserForBuilding,
  onBuildingDeleted,
  onSelectBuildingToEdit,
}) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);

  const handleDeleteClick = (buildingId) => {
    setShowConfirmModal(true);
    setSelectedBuildingId(buildingId);
  };

  const handleConfirmDelete = () => {
    // Функция для удаления объекта
    onBuildingDeleted(selectedBuildingId);
    setShowConfirmModal(false);
  };

  const handleClose = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      <ListGroup>
        {buildings &&
          buildings.map((building) => (
            <ListGroup.Item
              key={building.id}
              className="d-flex justify-content-between align-items-center"
            >
              <div style={{ flex: "1" }}>
                <div>{`${building.number} - ${building.name}`}</div>
                <div style={{ fontSize: "0.8em", color: "#666" }}>
                  {building.description.length > 100
                    ? `${building.description.substring(0, 100)}...`
                    : building.description}
                </div>
              </div>
              <div className="d-flex align-items-center">
                <Button
                  variant="outline-primary"
                  onClick={() => onSelectUserForBuilding(building.id)}
                  className="me-2"
                >
                  Добавить исполнителя
                </Button>
                <Button
                  variant="warning"
                  onClick={() => onSelectBuildingToEdit(building.id)}
                  className="me-2"
                >
                  Редактировать
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteClick(building.id)}
                >
                  Удалить объект
                </Button>
              </div>
            </ListGroup.Item>
          ))}
      </ListGroup>

      <Modal show={showConfirmModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Удаление объекта</Modal.Title>
        </Modal.Header>
        <Modal.Body>Вы уверены, что хотите удалить этот объект?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Нет
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Да, удалить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default BuildingList;
