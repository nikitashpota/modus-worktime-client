import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { PlusLg as PlusIcon } from "react-bootstrap-icons";
import WorkEntriesModal from "./WorkEntriesModal";
import { useAuth } from "../services/AuthContext";

const TimeTableCell = ({ date, logs, sectionId, buildingId, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const { userId } = useAuth();

  // Преобразование строки даты в объект Date
  const dateObject = new Date(date.split(".").reverse().join("-"));
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Сброс времени текущей даты

  // Создание даты для сравнения (три дня назад от текущей даты)
  const threeDaysAgo = new Date(currentDate);
  threeDaysAgo.setDate(currentDate.getDate() - 2);

  // Проверка, находится ли дата в пределах последних трех дней
  const isActive = dateObject > threeDaysAgo;

  // Проверка, совпадает ли дата с сегодняшним днем
  const isToday = dateObject.toDateString() === currentDate.toDateString();

  // Проверка, выпадает ли дата на выходной
  const isWeekend = dateObject.getDay() === 0 || dateObject.getDay() === 6;

  const calculateTotalHours = () => {
    return logs.reduce((sum, log) => sum + parseFloat(log.hours), 0);
  };

  const handleCellClick = () => {
    if (isActive) {
      setShowModal(true);
    }
  };

  return (
    <>
      <Button
        variant="outline-primary"
        onClick={handleCellClick}
        disabled={!isActive}
        style={{
          border: "none",
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          borderRadius: 0,
          // backgroundColor: isToday
          //   ? "lightgreen"
          //   : !isActive
          //   ? "#ddd"
          //   : isWeekend
          //   ? "lightcoral"
          //   : "",
          color: !isActive || isWeekend ? "#666" : "",
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
