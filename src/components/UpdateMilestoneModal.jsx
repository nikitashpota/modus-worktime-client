import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const UpdateMilestoneModal = ({
  show,
  onHide,
  onSave,
  milestone,
  typeDate,
}) => {
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");

  // [typeDate === "ActualDate"
  // ? "updatedDate"
  // : typeDate === "InitialDate"
  // ? "initialDate"
  // : "date"]

  useEffect(() => {
    if (milestone) {
      setDate(
        typeDate === "ActualDate"
          ? milestone.updatedDate
          : typeDate === "InitialDate"
          ? milestone.initialDate
          : milestone.date
      );
      setReason("");
    }
  }, [milestone, typeDate]);

  const handleSave = () => {
    if (date && reason) {
      console.log(date, reason);
      onSave(date, reason);
      onHide();
    } else {
      alert("Дата и причина изменения должны быть указаны.");
    }
  };

  if (!milestone) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Обновление вехи {milestone.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicDate">
            <Form.Label>Дата</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formBasicReason">
            <Form.Label>Причина изменения</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Сохранить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateMilestoneModal;
