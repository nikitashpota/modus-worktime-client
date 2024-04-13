import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "../services/axios";
import EditableTextField from "./EditableTextField";
import { useParams } from "react-router-dom";

const BuildingDetails = ({ building, handleIsUpdated }) => {
  const [_building, setBuilding] = useState(building);
  const { buildingId } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBuilding((prevBuilding) => ({
      ...prevBuilding,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`/buildings/${buildingId}`, _building);
      alert("Данные успешно обновлены!");
    } catch (error) {
      console.error("Ошибка при обновлении данных здания:", error);
      alert("Ошибка при обновлении данных!");
    }
    handleIsUpdated();
  };

  return (
    <Form>
      <EditableTextField
        label="Шифр"
        name="number"
        value={_building.number}
        onChange={handleChange}
      />
      <EditableTextField
        label="Наименование"
        name="name"
        value={_building.name}
        onChange={handleChange}
      />
      <EditableTextField
        label="Описание"
        name="description"
        value={_building.description}
        onChange={handleChange}
        as="textarea"
        rows={3}
      />
      <Button
        onClick={handleSaveChanges}
        variant="outline-success"
        style={{ marginTop: "15px" }}
      >
        Сохранить
      </Button>
    </Form>
  );
};

export default BuildingDetails;
