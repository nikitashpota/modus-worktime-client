import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const TaskEditModal = ({ show, task, onClose, onTaskUpdated }) => {
  const [formData, setFormData] = useState({
    sectionId: task.sectionId,
    receiverId: task.receiverId,
    content: task.content,
    description: task.description,
    startDate: task.startDate,
    endDate: task.endDate,
    status: task.status,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/tasks/${task.id}`, formData);
      onTaskUpdated(response.data);
    } catch (error) {
      console.error("Ошибка при обновлении задачи", error);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Редактировать задачу</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formSectionId">
            <Form.Label>Раздел</Form.Label>
            <Form.Control
              type="text"
              name="sectionId"
              value={formData.sectionId}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formReceiverId">
            <Form.Label>Исполнитель</Form.Label>
            <Form.Control
              type="text"
              name="receiverId"
              value={formData.receiverId}
              onChange={handleChange}
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
          <Form.Group controlId="formStartDate">
            <Form.Label>Начало выполнения</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
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
          <Form.Group controlId="formStatus">
            <Form.Label>Статус</Form.Label>
            <Form.Control
              as="select"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option>Выдано</option>
              <option>Принято в работу</option>
              <option>Выполнено</option>
              <option>Проверено</option>
              <option>Закрыто</option>
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit">
            Сохранить изменения
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TaskEditModal;
