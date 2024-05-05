import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import React, { useState, useEffect } from "react";

const ConfirmDeleteModal = ({
  show,
  handleClose,
  buildingNumber,
  onConfirm,
}) => {
  const [inputNumber, setInputNumber] = useState("");

  const handleConfirmClick = () => {
    if (inputNumber === buildingNumber) {
      onConfirm();
      handleClose();
    } else {
      alert("Неправильный код здания.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Подтверждение удаления</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          При удалении будут удалены все записи, связанные с рабочими логами,
          разделами и т. д.
        </p>

        <p>
          Введите шифр объекта <span style={{fontWeight: "500"}}>{buildingNumber}</span> для подтверждения
          его удаления:
        </p>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Введите номер здания"
            value={inputNumber}
            onChange={(e) => setInputNumber(e.target.value)}
          />
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Отмена
        </Button>
        <Button variant="danger" onClick={handleConfirmClick}>
          Удалить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDeleteModal;
