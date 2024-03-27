import React, { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import axios from "../services/axios";

function EditBuildingModal({
  buildingId,
  show,
  handleClose,
  updateBuildingList,
}) {
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Загрузка данных о здании для редактирования
  useEffect(() => {
    if (buildingId) {
      axios.get(`/buildings/${buildingId}`).then((response) => {
        const { number, name, description } = response.data;
        setNumber(number);
        setName(name);
        setDescription(description);
      });
    }
  }, [buildingId]);

  const handleSave = () => {
    const updatedBuilding = { number, name, description };
    axios
      .put(`/buildings/${buildingId}`, updatedBuilding)
      .then(() => {
        updateBuildingList();
        handleClose();
      })
      .catch((error) => console.error("Ошибка при обновлении здания:", error));
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Редактирование здания</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Номер</Form.Label>
            <Form.Control
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Наименование</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Описание</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Отмена
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Сохранить изменения
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditBuildingModal;
