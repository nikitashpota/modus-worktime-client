import React from "react";
import {
  Form,
  Button,
  ListGroup,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { Trash, List } from "react-bootstrap-icons";
import milestonesData from "../services/milestonesData";

const MilestoneForm = ({
  milestones,
  onDateChange,
  onDeleteMilestone,
  onAddMilestone,
}) => {
  const handleNameChange = (id, newName) => {
    const newCode = milestonesData.find((m) => m.label === newName)?.code || "";
    onDateChange(id, "name", newName);
    onDateChange(id, "code", newCode);
  };

  return (
    <Form>
      <div className="d-flex mt-3 mb-3" style={{ gap: "8px" }}>
        <Button
          variant="outline-primary"
          onClick={onAddMilestone}
          style={{ width: "140px" }}
        >
          Добавить веху
        </Button>
      </div>
      <ListGroup variant="flush">
        {milestones.map((milestone, index) => (
          <ListGroup.Item
            key={milestone.id}
            className="border-0"
            style={{ padding: 0 }}
          >
            <InputGroup className="mb-3">
              <Button
                variant="outline-secondary"
                style={{ width: "40px", flex: "none" }}
              >
                <List />
              </Button>

              <FormControl
                as="select"
                onChange={(e) => handleNameChange(milestone.id, e.target.value)}
                style={{ flex: "1" }}
                value={milestone.name}
              >
                {milestonesData.map((m) => (
                  <option key={m.code} value={m.label}>
                    {m.label}
                  </option>
                ))}
              </FormControl>
              <FormControl
                as="input"
                readOnly
                value={milestone.code}
                style={{ width: "10%", flex: "none", textAlign: "center" }}
              />
              <FormControl
                type="date"
                value={milestone.date}
                onChange={(e) =>
                  onDateChange(milestone.id, "date", e.target.value)
                }
                style={{ width: "10%", flex: "none" }}
              />
              <Button
                variant="outline-danger"
                onClick={() => onDeleteMilestone(milestone.id)}
                style={{ width: "40px", flex: "none" }}
              >
                <Trash />
              </Button>
            </InputGroup>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Form>
  );
};

export default MilestoneForm;
