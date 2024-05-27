import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Dropdown,
  DropdownButton,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import milestonesData from "../services/milestonesData"; // Убедитесь, что данные загружены правильно

const AddMilestoneModal = ({ show, onHide, onAdd }) => {
  const [selectedName, setSelectedName] = useState(milestonesData[0].label);
  const [selectedCode, setSelectedCode] = useState(milestonesData[0].code);
  const [initialDate, setInitialDate] = useState("");

  const handleNameChange = (eventKey) => {
    const milestone = milestonesData.find((m) => m.label === eventKey);
    setSelectedName(milestone.label);
    setSelectedCode(milestone.code);
  };

  const handleSubmit = () => {
    if (!initialDate) {
      alert("Введите дату начала.");
      return;
    }
    onAdd(selectedName, selectedCode, initialDate);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Добавить веху проекта</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Наименование и начальная дата</Form.Label>
            <InputGroup>
              <FormControl
                as="select"
                onChange={(e) => handleNameChange(e.target.value)}
                style={{ flex: "1" }}
                value={milestonesData[0].name}
              >
                {milestonesData.map((m) => (
                  <option key={m.code} value={m.label}>
                    {m.label}
                  </option>
                ))}
              </FormControl>
              <FormControl
                type="date"
                value={initialDate}
                onChange={(e) => setInitialDate(e.target.value)}
                style={{ width: "20%", flex: "none" }}
              />
            </InputGroup>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-primary"
          onClick={handleSubmit}
          style={{ width: "150px" }}
        >
          Добавить веху
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddMilestoneModal;
