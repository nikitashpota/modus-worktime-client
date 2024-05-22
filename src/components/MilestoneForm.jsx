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
          style={{ width: "140px", marginBottom: "38px" }}
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
                  disabled={userRole === "Проектировщик" ? true : false}
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
                  disabled={userRole !== "Администратор" ? true : false}
                  onClick={() => handleOpenModal(milestone, "InitialDate")}
                >
                  Изменить Дата исход. договора
                </Dropdown.Item>
              </DropdownButton>
              <div style={{ flex: "1", position: "relative" }}>
                {index === 0 && <MilestoneHeader title="Наименование вехи" />}
                <FormControl
                  as="select"
                  disabled={userRole === "Проектировщик" ? true : false}
                  onChange={(e) =>
                    handleNameAndCodeChange(milestone.id, e.target.value)
                  }
                  value={milestone.name}
                >
                  {milestonesData.map((m) => (
                    <option key={m.code} value={m.label}>
                      {m.label}
                    </option>
                  ))}
                </FormControl>
              </div>
              <div style={{ width: "10%", flex: "none", position: "relative" }}>
                {index === 0 && <MilestoneHeader title="Код вехи" />}
                <FormControl
                  as="input"
                  readOnly
                  value={milestone.code}
                  style={{ textAlign: "center" }}
                />
              </div>
              <div style={{ width: "10%", flex: "none", position: "relative" }}>
                {index === 0 && <MilestoneHeader title="Факт. дата" />}
                <FormControl
                  type="date"
                  value={milestone.updatedDate}
                  readOnly={true}
                  style={{
                    backgroundColor: "#d9221180",
                    textAlign: "center",
                  }}
                />
              </div>
              <div style={{ width: "10%", flex: "none", position: "relative" }}>
                {index === 0 && <MilestoneHeader title="Доп. дата" />}
                <FormControl
                  type="date"
                  value={milestone.date}
                  readOnly={true}
                  style={{
                    backgroundColor: "#f2bc1b87",
                    textAlign: "center",
                  }}
                />
              </div>
              <div style={{ width: "10%", flex: "none", position: "relative" }}>
                {index === 0 && <MilestoneHeader title="Исх. дата" />}
                <FormControl
                  type="date"
                  value={milestone.initialDate}
                  readOnly={true}
                  style={{
                    backgroundColor: "#15bfbf80",
                    textAlign: "center",
                  }}
                />
              </div>

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

const MilestoneHeader = ({ title }) => (
  <div
    style={{
      position: "absolute",
      top: "-45px",
      left: "50%", // Устанавливаем элемент на середину относительно родителя
      transform: "translateX(-50%)", // Сдвигаем элемент на 50% его ширины назад, для центрирования
      background: "#f8f9fa",
      padding: "5px 15px",
      borderRadius: "6px",
      textAlign: "center",
      zIndex: 1000,
      whiteSpace: "nowrap", // Предотвращаем перенос текста
    }}
  >
    {title}
  </div>
);

export default MilestoneForm;
