import React from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";

const LoadTemplateModal = ({ show, onHide, templates, onLoadTemplate }) => {
  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "18px" }}>Выберите шаблон:</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {templates.map((template, index) => (
            <ListGroup.Item
              key={index}
              action
              onClick={() => onLoadTemplate(template)}
            >
              {template.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
};

export default LoadTemplateModal;
