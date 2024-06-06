import React from "react";
import { Modal, Button, Form, FormControl } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";

const EditSectionModal = ({
  show,
  onHide,
  section,
  onChange,
  onSave,
  onAddModification,
  onDeleteModification,
}) => {
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
          <p className="text-center">Реестр изменений</p>
          <div className="d-flex justify-content-center mb-3">
            <Button variant="outline-primary" onClick={onAddModification}>
              Добавить
            </Button>
            <FormControl
              type="date"
              className="ms-2"
              placeholder="дд.мм.гггг"
              value={section.newModificationDate || ""}
              onChange={(e) =>
                onChange({
                  target: {
                    name: "newModificationDate",
                    value: e.target.value,
                  },
                })
              }
            />
          </div>
          <Form.Group className="mb-3">
            {section.modifications &&
              section.modifications.map((modification, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center mb-2"
                  style={{ width: "100%" }}
                >
                  <div style={{ flex: "0 0 10%", textAlign: "center" }}>
                    {`Изм. ${index + 1}`}
                  </div>
                  <FormControl
                    type="date"
                    value={modification.date}
                    onChange={(e) =>
                      onChange({
                        target: {
                          name: `modifications[${index}].date`,
                          value: e.target.value,
                        },
                      })
                    }
                    className="me-2"
                    style={{ flex: "1 0 auto", width: "auto" }}
                  />
                  <Button
                    variant="outline-danger"
                    onClick={() => onDeleteModification(index)}
                    style={{ flex: "0 0 auto" }}
                  >
                    <Trash />
                  </Button>
                </div>
              ))}
          </Form.Group>
          <div className="text-center">
            <Button variant="outline-primary" onClick={onSave}>
              Сохранить
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditSectionModal;
