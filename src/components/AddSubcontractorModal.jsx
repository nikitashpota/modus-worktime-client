import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddSubcontractorModal = ({ show, onHide, onAdd }) => {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");

  const handleSubmit = () => {
    if (name && cost) {
      onAdd({ name, cost: parseFloat(cost) });
      onHide(); // Закрыть модальное окно после добавления
      setName(""); // Очистка полей после добавления
      setCost("");
    } else {
      alert("Пожалуйста, заполните все поля.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Добавление субподрядчика</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Наименование субподрядчика</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите наименование"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Стоимость (тыс. р.)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Укажите стоимость"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Добавить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddSubcontractorModal;
