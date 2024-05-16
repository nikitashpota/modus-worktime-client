import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import axios from "../services/axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import EditableTextField from "./EditableTextField";
import buildingTypes from "../services/buildingTypesData";

const BuildingDetails = ({ building, handleIsUpdated }) => {
  const [_building, setBuilding] = useState(building);
  const { buildingId } = useParams();
  const { userId, userRole } = useAuth();
  console.log(_building);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBuilding((prevBuilding) => ({
      ...prevBuilding,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`/buildings/${buildingId}`, { ..._building, userId });
      alert("Данные успешно обновлены!");
      handleIsUpdated();
    } catch (error) {
      console.error("Ошибка при обновлении данных здания:", error);
      alert("Ошибка при обновлении данных!");
    }
  };

  return (
    <div>
      <Card>
        <Card.Header>Основные данные</Card.Header>
        <Card.Body>
          <Form>
            <EditableTextField
              type="text"
              label="Технический заказчик"
              name="technicalCustomer"
              value={_building.technicalCustomer}
              onChange={handleChange}
            />
            <EditableTextField
              type="text"
              label="Шифр объекта"
              name="number"
              value={_building.number}
              onChange={handleChange}
            />
            <EditableTextField
              type="text"
              label="Наименование краткое"
              name="name"
              value={_building.name}
              onChange={handleChange}
            />
            <EditableTextField
              type="textarea"
              label="Наименование полное"
              name="description"
              value={_building.description}
              onChange={handleChange}
            />
            <Button
              disabled={userRole === "Проектировщик" ? true : false}
              onClick={handleSaveChanges}
              variant="outline-success"
              style={{ marginTop: "16px" }}
            >
              Сохранить
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card
        style={{
          marginTop: "20px",
          display: userRole === "Проектировщик" ? "none" : "block",
        }}
      >
        <Card.Header>Стоимость объекта капитального строительства </Card.Header>
        <Card.Body>
          <Form>
            <EditableTextField
              label="Начальная стоимость ОКС по договору (руб)"
              type="number"
              name="initialContractValue"
              value={_building.initialContractValue}
              onChange={handleChange}
            />
            <EditableTextField
              label="Текущая стоимость ОКС по договору (руб)"
              type="number"
              name="currentContractValue"
              value={_building.currentContractValue}
              onChange={handleChange}
            />
            <Button
              disabled={userRole === "Проектировщик" ? true : false}
              onClick={handleSaveChanges}
              variant="outline-primary"
              style={{ marginTop: "16px" }}
            >
              Сохранить
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card style={{ marginTop: "20px" }}>
        <Card.Header>Технико-экономические показатели</Card.Header>
        <Card.Body>
          <Form>
            <EditableTextField
              type="select"
              label="Функциональное назначение"
              name="functionalPurpose"
              value={_building.functionalPurpose}
              onChange={handleChange}
              options={buildingTypes.reduce((acc, type) => {
                acc[type.Key] = type.Value;
                return acc;
              }, {})}
            />
            <EditableTextField
              type="text"
              label="Согласующий орган"
              name="approvingAuthority"
              value={_building.approvingAuthority}
              onChange={handleChange}
            />
            <EditableTextField
              label="Площадь земельного участка (га)"
              type="number"
              name="landArea"
              value={_building.landArea}
              onChange={handleChange}
            />
            <EditableTextField
              label="Максимальная плотность застройки (кв.м/га)"
              type="number"
              name="maxDensity"
              value={_building.maxDensity}
              onChange={handleChange}
            />
            <EditableTextField
              label="Предельная высота зданий, строений, сооружений (м)"
              type="number"
              name="maxHeight"
              value={_building.maxHeight}
              onChange={handleChange}
            />
            <EditableTextField
              label="Суммарная поэтажная площадь объекта в габаритах наружных стен (м²)"
              type="number"
              name="totalFloorArea"
              value={_building.totalFloorArea}
              onChange={handleChange}
            />
            <EditableTextField
              label="Площадь здания в габаритах наружных стен (м²)"
              type="number"
              name="buildingArea"
              value={_building.buildingArea}
              onChange={handleChange}
            />
            <EditableTextField
              label="Подземный одноуровневый паркинг (маш/мест)"
              type="number"
              name="undergroundParkingSpaces"
              value={_building.undergroundParkingSpaces}
              onChange={handleChange}
            />
            <EditableTextField
              label="Площадь подземного паркинга (м²)"
              type="number"
              name="undergroundParkingArea"
              value={_building.undergroundParkingArea}
              onChange={handleChange}
            />
            <EditableTextField
              label="Расчетное количество жителей (кол)"
              type="number"
              name="estimatedPopulation"
              value={_building.estimatedPopulation}
              onChange={handleChange}
            />
            <Button
              disabled={userRole === "Проектировщик" ? true : false}
              onClick={handleSaveChanges}
              variant="outline-primary"
              style={{ marginTop: "16px" }}
            >
              Сохранить
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BuildingDetails;
