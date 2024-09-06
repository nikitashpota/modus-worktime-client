import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select"; // Для выпадающих списков с поиском
import axios from "../services/axios"; // Используем кастомную настройку axios
import { useAuth } from "../services/AuthContext";

const TaskCreateModal = ({ show, onClose, onTaskCreated }) => {
  const { userId } = useAuth(); // Получаем текущего пользователя

  const [formData, setFormData] = useState({
    buildingId: "",
    sectionId: "",
    receiverId: "",
    issuerId: userId, // Устанавливаем текущего пользователя как автора задачи
    content: "",
    description: "",
    endDate: "",
    urgency: "Обычная",
    status: "Выдано", // Устанавливаем статус задачи по умолчанию
    issuedAt: new Date().toISOString(), // Записываем текущую дату как дату выдачи задачи
    issuedBy: userId, // Записываем ID пользователя как того, кто выдал задачу
  });

  const [buildings, setBuildings] = useState([]); // Для списка зданий
  const [sections, setSections] = useState([]); // Для списка разделов
  const [receivers, setReceivers] = useState([]); // Для списка исполнителей

  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingSections, setLoadingSections] = useState(false);
  const [loadingReceivers, setLoadingReceivers] = useState(false);

  // Загрузка списка зданий при монтировании компонента
  useEffect(() => {
    const fetchBuildings = async () => {
      setLoadingBuildings(true);
      try {
        const response = await axios.get("buildings"); // Запрос на сервер для получения зданий
        const buildingOptions = response.data
          .map((building) => ({
            value: building.id,
            label: `${building.number} - ${building.name}`,
          }))
          .sort((a, b) => a.label.localeCompare(b.label)); // Сортировка по label
        setBuildings(buildingOptions);
        setLoadingBuildings(false);
      } catch (error) {
        console.error("Ошибка при загрузке списка зданий:", error);
        setLoadingBuildings(false);
      }
    };

    fetchBuildings();
  }, []);

  // Загрузка списка разделов при выборе здания
  const handleBuildingChange = async (selectedOption) => {
    setFormData({
      ...formData,
      buildingId: selectedOption.value,
      sectionId: "",
    }); // Обновляем buildingId, сбрасываем sectionId
    setSections([]); // Сбрасываем разделы при изменении здания

    if (selectedOption.value) {
      setLoadingSections(true);
      try {
        const response = await axios.get(
          `sections/by-building/${selectedOption.value}`
        ); // Запрос на сервер для получения разделов по buildingId
        const sectionOptions = response.data.map((section) => ({
          value: section.id,
          label: `${section.stage} - ${section.sectionCode}`,
        }));
        setSections(sectionOptions);
        setLoadingSections(false);
      } catch (error) {
        console.error("Ошибка при загрузке разделов:", error);
        setLoadingSections(false);
      }

      // Загружаем список исполнителей при выборе здания
      setLoadingReceivers(true);
      try {
        const response = await axios.get("users"); // Запрос на сервер для получения пользователей (исполнителей)
        const receiverOptions = response.data.map((user) => ({
          value: user.id,
          label: `${user.firstName} ${user.lastName}`,
        }));
        setReceivers(receiverOptions);
        setLoadingReceivers(false);
      } catch (error) {
        console.error("Ошибка при загрузке списка исполнителей:", error);
        setLoadingReceivers(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSectionChange = (selectedOption) => {
    setFormData({
      ...formData,
      sectionId: selectedOption ? selectedOption.value : "",
    });
  };

  const handleReceiverChange = (selectedOption) => {
    setFormData({ ...formData, receiverId: selectedOption.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Добавляем текущую дату как startDate
      const startDate = new Date().toISOString();
  
      const response = await axios.post("/tasks", {
        ...formData,
        issuerId: userId, // ID текущего пользователя
        startDate, // Дата создания задачи
        sectionId: formData.sectionId === "" ? null : formData.sectionId, // Обрабатываем пустое значение sectionId
      });
      onTaskCreated(response.data);
      onClose();
    } catch (error) {
      console.error("Ошибка при создании задачи", error);
    }
  };
  

  return (
    <Modal show={show} onHide={onClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Создать задачу</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Выбор здания (обязательный) */}
          <Form.Group controlId="formBuildingId">
            <Form.Label>Объект (обязательно)</Form.Label>
            <Select
              options={buildings}
              onChange={handleBuildingChange}
              isLoading={loadingBuildings}
              placeholder="Выберите объект"
              isSearchable
              required
            />
          </Form.Group>

          {/* Выбор раздела (необязательный) */}
          <Form.Group controlId="formSectionId">
            <Form.Label>Раздел (не обязательно)</Form.Label>
            <Select
              options={sections}
              onChange={handleSectionChange}
              isLoading={loadingSections}
              placeholder="Выберите раздел"
              isSearchable
              isClearable // Добавляет возможность очищать выбор
            />
          </Form.Group>

          {/* Выбор исполнителя */}
          <Form.Group controlId="formReceiverId">
            <Form.Label>Исполнитель (обязательно)</Form.Label>
            <Select
              options={receivers}
              onChange={handleReceiverChange}
              isLoading={loadingReceivers}
              placeholder="Выберите исполнителя"
              isSearchable
              required
            />
          </Form.Group>

          <Form.Group controlId="formContent">
            <Form.Label>Наименование задачи</Form.Label>
            <Form.Control
              type="text"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formDescription">
            <Form.Label>Описание задачи</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formEndDate">
            <Form.Label>Конец выполнения</Form.Label>
            <Form.Control
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formUrgency">
            <Form.Label>Срочность</Form.Label>
            <Form.Control
              as="select"
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              required
            >
              <option>Обычная</option>
              <option>Срочная</option>
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit">
            Создать задачу
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TaskCreateModal;
