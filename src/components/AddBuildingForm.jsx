import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import axios from "../services/axios";
import { ChevronUp, ChevronDown } from "react-bootstrap-icons";

function AddBuildingForm({ onBuildingAdded }) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [description, setDescription] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(
    JSON.parse(localStorage.getItem("addBuildingFormCollapsed"))
  );

  // Эффект для сохранения состояния в localStorage при его изменении
  useEffect(() => {
    localStorage.setItem(
      "addBuildingFormCollapsed",
      JSON.stringify(isCollapsed)
    );
  }, [isCollapsed]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log("Buildings", name, description);

      await axios.post("/buildings", { name, description, number });
      onBuildingAdded();
      setName("");
      setDescription("");
    } catch (error) {
      console.error("Ошибка при добавлении объекта:", error);
    }
  };

  // Функция для переключения состояния isCollapsed и обработчик кнопки
  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Card style={{ marginBottom: "16px" }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <Card.Title>Добавить новый объект</Card.Title>
          <div onClick={toggleCollapsed} style={{ cursor: "pointer" }}>
            {isCollapsed ? <ChevronDown /> : <ChevronUp />}
          </div>
        </div>
        {!isCollapsed && (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Номер объекта</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите номер или шифр"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Название объекта</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите название"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Описание объекта</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Введите описание"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Добавить
            </Button>
          </Form>
        )}
      </Card.Body>
    </Card>
  );
}

export default AddBuildingForm;
