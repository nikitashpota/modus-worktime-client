import React from "react";
import { Modal, Button, Form, FormControl } from "react-bootstrap";

const EditSectionModal = ({ show, onHide, section, onChange, onSave }) => {
  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Редактировать раздел</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Код раздела</Form.Label>
            <FormControl
              type="text"
              name="sectionCode"
              value={section.sectionCode}
              onChange={onChange}
              placeholder="Введите код раздела"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Наименование раздела</Form.Label>
            <FormControl
              type="text"
              name="sectionName"
              value={section.sectionName}
              onChange={onChange}
              placeholder="Введите наименование раздела"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Дата начала</Form.Label>
            <FormControl
              type="date"
              name="startDate"
              value={section.startDate}
              onChange={onChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Дата окончания</Form.Label>
            <FormControl
              type="date"
              name="endDate"
              value={section.endDate}
              onChange={onChange}
            />
          </Form.Group>
          <Button variant="outline-primary" onClick={onSave}>
            Сохранить
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditSectionModal;
