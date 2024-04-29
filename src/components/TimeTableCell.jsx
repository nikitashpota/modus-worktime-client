import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { PlusLg as PlusIcon } from "react-bootstrap-icons";
import WorkEntriesModal from "./WorkEntriesModal";
import { useAuth } from "../services/AuthContext"; // Контекст аутентификации

// Предположим, что WorkEntriesModal - это ваш компонент модального окна
// import WorkEntriesModal from './WorkEntriesModal';

const TimeTableCell = ({ date, logs, sectionId, buildingId, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {}, [showModal]);

  const { userId } = useAuth();
  // Функция для расчета суммы часов
  const calculateTotalHours = () => {
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
        style={{
          border: "none",
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          borderRadius: 0,
        }}
      >
        {logs.length > 0 ? `${calculateTotalHours()} ч` : <PlusIcon />}
      </Button>
      <WorkEntriesModal
        key={`${sectionId}_${date}`}
        show={showModal}
        onHide={() => setShowModal(false)}
        logs={logs}
        userId={userId}
        sectionId={sectionId}
        buildingId={buildingId}
        date={date}
        onUpdateTable={onUpdate}
      />
    </>
  );
};

export default TimeTableCell;
