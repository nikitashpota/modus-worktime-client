import { useState } from "react";
import {
  Form,
  Button,
  ListGroup,
  InputGroup,
  FormControl,
  FormLabel,
  FormText,
} from "react-bootstrap";
import { Trash, List } from "react-bootstrap-icons";
import milestonesData from "../services/milestonesData";
import { Dropdown, DropdownButton } from "react-bootstrap";
import UpdateMilestoneModal from "./UpdateMilestoneModal";

const MilestoneForm = ({
  milestones,
  onUpdateMilestone,
  onDeleteMilestone,
  onAddMilestone,
  userName,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [isActualUpdate, setIsActualUpdate] = useState(false);

  const handleOpenModal = (milestone, actual) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedMilestone(milestone);
    setIsActualUpdate(actual);
    setShowModal(true);
  };

  const handleNameAndCodeChange = (id, newName) => {
    const newCode = milestonesData.find((m) => m.label === newName)?.code || "";
    const updateData = {
      name: newName,
      code: newCode,
    };
    onUpdateMilestone(id, updateData);
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
              <DropdownButton
                id="dropdown-item-button"
                title=""
                variant="outline-secondary"
                style={{
                  width: "40px",
                  flex: "none",
                  zIndex: "0",
                  border: "1px solid #d3d3d3",
                  marginRight: "5px",
                }}
              >
                <Dropdown.Item
                  as="button"
                  onClick={() => handleOpenModal(milestone, false)}
                >
                  Изменить начальную дату
                </Dropdown.Item>
                <Dropdown.Item
                  as="button"
                  onClick={() => handleOpenModal(milestone, true)}
                >
                  Актуализировать дату
                </Dropdown.Item>
              </DropdownButton>

              <FormControl
                as="select"
                onChange={(e) =>
                  handleNameAndCodeChange(milestone.id, e.target.value)
                }
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
                readOnly={true}
                style={{
                  width: "10%",
                  flex: "none",
                  backgroundColor: "#A3B4D9",
                }}
              />
              <FormControl
                type="date"
                value={milestone.updatedDate}
                readOnly={true}
                style={{
                  width: "10%",
                  flex: "none",
                  backgroundColor: "#FFBFBF",
                }}
              />
              <Button
                variant="outline-danger"
                onClick={() => onDeleteMilestone(milestone.id)}
                style={{ width: "40px", flex: "none", zIndex: "0" }}
              >
                <Trash />
              </Button>
            </InputGroup>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <UpdateMilestoneModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={(date, reason) =>
          onUpdateMilestone(selectedMilestone.id, {
            [isActualUpdate ? "updatedDate" : "date"]: date,
            [isActualUpdate ? "updatedDateChangeReason" : "dateChangeReason"]:
              reason,
            [isActualUpdate
              ? "userResponsibleForUpdate"
              : "userResponsibleForChange"]: userName,
          })
        }
        milestone={selectedMilestone}
        isActualUpdate={isActualUpdate}
      />
    </Form>
  );
};

export default MilestoneForm;
