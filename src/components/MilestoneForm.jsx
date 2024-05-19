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
import { Trash, PencilSquare } from "react-bootstrap-icons";
import milestonesData from "../services/milestonesData";
import { Dropdown, DropdownButton } from "react-bootstrap";
import UpdateMilestoneModal from "./UpdateMilestoneModal";
import AddMilestoneModal from "./AddMilestoneModal";
import { useAuth } from "../services/AuthContext";

const MilestoneForm = ({
  milestones,
  onUpdateMilestone,
  onDeleteMilestone,
  onAddMilestone,
  userName,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [typeDate, setTypeDate] = useState("");
  const { userRole } = useAuth();
  const handleOpenModal = (milestone, type) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedMilestone(milestone);
    setTypeDate(type);
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
    <Form style={{ display: userRole === "Проектировщик" ? "none" : "block" }}>
      <div className="d-flex mt-3 mb-3" style={{ gap: "8px" }}>
        <Button
          variant="outline-primary"
          onClick={() => setShowAddModal(true)}
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
                  border: "1px solid #d3d3d3",
                  marginRight: "5px",
                }}
              >
                <Dropdown.Item
                  as="button"
                  onClick={() => handleOpenModal(milestone, "ActualDate")}
                  disabled={userRole !== "Администратор" ? true : false}
                >
                  Изменить Дата фактическая
                </Dropdown.Item>

                <Dropdown.Item
                  as="button"
                  disabled={userRole === "Проектировщик" ? true : false}
                  onClick={() => handleOpenModal(milestone, "AmendedDate")}
                >
                  Изменить Дата доп. договора
                </Dropdown.Item>
                <Dropdown.Item
                  as="button"
                  disabled={userRole === "Проектировщик" ? true : false}
                  onClick={() => handleOpenModal(milestone, "InitialDate")}
                >
                  Изменить Дата исход. договора
                </Dropdown.Item>
              </DropdownButton>
              <FormControl
                as="select"
                disabled={userRole === "Проектировщик" ? true : false}
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
                value={milestone.updatedDate}
                readOnly={true}
                style={{
                  width: "10%",
                  flex: "none",
                  backgroundColor: "#d9221180",
                  textAlign: "center",
                }}
              />
              <FormControl
                type="date"
                value={milestone.date}
                readOnly={true}
                style={{
                  width: "10%",
                  flex: "none",
                  backgroundColor: "#f2bc1b87",
                  textAlign: "center",
                }}
              />
              <FormControl
                type="date"
                value={milestone.initialDate}
                readOnly={true}
                style={{
                  width: "10%",
                  flex: "none",
                  backgroundColor: "#15bfbf80",
                  textAlign: "center",
                }}
              />
              <Button
                variant="outline-danger"
                onClick={() => onDeleteMilestone(milestone.id)}
                style={{
                  width: "40px",
                  flex: "none",
                  zIndex: "0",
                }}
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
            [typeDate === "ActualDate"
              ? "updatedDate"
              : typeDate === "InitialDate"
              ? "initialDate"
              : "date"]: date,
            [typeDate === "ActualDate"
              ? "updatedDateChangeReason"
              : typeDate === "InitialDate"
              ? "initialDateChangeReason"
              : "dateChangeReason"]: reason,
            [typeDate === "ActualDate"
              ? "userResponsibleForUpdate"
              : typeDate === "InitialDate"
              ? "userResponsibleForInitialDate"
              : "userResponsibleForChange"]: userName,
          })
        }
        milestone={selectedMilestone}
        typeDate={typeDate}
      />
      <AddMilestoneModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onAdd={onAddMilestone}
      />
    </Form>
  );
};

export default MilestoneForm;
