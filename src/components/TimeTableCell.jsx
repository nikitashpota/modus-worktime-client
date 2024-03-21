import { useState } from "react";
import { Button } from "react-bootstrap";
import { PlusLg as PlusIcon } from "react-bootstrap-icons";
import WorkEntriesModal from "./WorkEntriesModal";
import { useAuth } from "../services/AuthContext"; // Контекст аутентификации

// Предположим, что WorkEntriesModal - это ваш компонент модального окна
// import WorkEntriesModal from './WorkEntriesModal';

const TimeTableCell = ({ date, logs, buildingId, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const { userId } = useAuth();
  // Функция для расчета суммы часов
  const calculateTotalHours = () => {
    return logs.reduce((sum, log) => sum + parseFloat(log.hours), 0);
  };

  const handleCellClick = () => {
    console.log("handleCellClick", logs);
    setShowModal(true);
  };

  return (
    <>
      <Button
        variant="outline-primary"
        onClick={handleCellClick}
        style={{ width: "50px" }}
      >
        {logs.length > 0 ? `${calculateTotalHours()} ч` : <PlusIcon />}
      </Button>
      <WorkEntriesModal
        show={showModal}
        onHide={() => setShowModal(false)}
        initialEntries={logs}
        userId={userId}
        buildingId={buildingId}
        date={date}
        onUpdateTable={onUpdate}
      />
    </>
  );
};

export default TimeTableCell;
