import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "../services/axios";

const MilestoneStatusModal = ({ show, onHide, onSave, milestone }) => {
  const [status, setStatus] = useState(milestone?.status);

  useEffect(() => {
    setStatus(milestone?.status);
  }, [milestone]);

  const handleSubmit = async () => {
    try {
      milestone.status = status;
      onSave();
      onHide();
    } catch (error) {
      console.error("Ошибка при отправке формы:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Изменить статус вехи</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Выберите статус</Form.Label>
            <Form.Control
              as="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Активный">Активный</option>
              <option value="Завершено">Завершено</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={handleSubmit}>
          Сохранить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MilestoneStatusModal;
