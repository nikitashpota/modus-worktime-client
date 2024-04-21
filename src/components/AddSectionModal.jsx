import React from "react";
import { Modal, Button, Form, FormControl } from "react-bootstrap";

const AddSectionModal = ({ show, onHide, newSection, onChange, onAdd }) => {
  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Добавить новый раздел</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Код раздела</Form.Label>
            <FormControl
              type="text"
              name="sectionCode"
              value={newSection.sectionCode}
              onChange={onChange}
              placeholder="Введите код"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Наименование раздела</Form.Label>
            <FormControl
              type="text"
              name="sectionName"
              value={newSection.sectionName}
              onChange={onChange}
              placeholder="Введите наименование"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Дата начала</Form.Label>
            <FormControl
              type="date"
              name="startDate"
              value={newSection.startDate}
              onChange={onChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Дата окончания</Form.Label>
            <FormControl
              type="date"
              name="endDate"
              value={newSection.endDate}
              onChange={onChange}
            />
          </Form.Group>
          <Button variant="outline-primary" onClick={onAdd}>
            Добавить
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddSectionModal;
