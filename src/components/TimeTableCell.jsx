import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { PlusLg as PlusIcon } from "react-bootstrap-icons";
import WorkEntriesModal from "./WorkEntriesModal";
import { useAuth } from "../services/AuthContext"; // Контекст аутентификации

// Предположим, что WorkEntriesModal - это ваш компонент модального окна
// import WorkEntriesModal from './WorkEntriesModal';

const TimeTableCell = ({ date, logs, buildingId, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {}, [showModal]);

  const { userId } = useAuth();
  // Функция для расчета суммы часов
  const calculateTotalHours = () => {
    // console.log("calculateTotalHours", logs);
    return logs.reduce((sum, log) => sum + parseFloat(log.hours), 0);
  };

  const handleCellClick = () => {
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
        key={`${buildingId}_${date}`}
        show={showModal}
        onHide={() => setShowModal(false)}
        logs={logs}
        userId={userId}
        buildingId={buildingId}
        date={date}
        onUpdateTable={onUpdate}
      />
    </>
  );
};

export default TimeTableCell;
