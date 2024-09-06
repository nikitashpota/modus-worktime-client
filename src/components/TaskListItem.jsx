import React from "react";
import { ListGroup, Button } from "react-bootstrap";
import { ArrowRightShort, PencilFill, TrashFill } from "react-bootstrap-icons"; // Иконки стрелки, редактирования и удаления

const formatDate = (dateString) => {
  const options = { day: "2-digit", month: "2-digit", year: "2-digit" };
  return new Date(dateString).toLocaleDateString("ru-RU", options);
};

const TaskListItem = ({ task, onEditClick, onDeleteClick, userId }) => {
  const currentStatusDate =
    task.status === "Выдано"
      ? formatDate(task.issuedAt)
      : formatDate(task.updatedAt);

  const isIssuer = task.issuerId === userId;
  const isReceiver = task.receiverId === userId;

  return (
    <ListGroup.Item
      className="d-flex justify-content-between align-items-center p-3 mb-2"
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#fff",
      }}
    >
      {/* Блок с именами, названием задачи и описанием */}
      <div style={{ flex: "0 0 25%", textAlign: "center" }}>
        <div className="d-flex justify-content-center align-items-center mb-2">
          <div
            style={{
              border: "1px solid #ddd",
              padding: "8px 12px",
              borderRadius: "6px",
              fontWeight: "500",
              fontSize: "1rem",
              marginRight: "10px",
              textAlign: "center",
              minWidth: "150px",
            }}
          >
            {task.issuer
              ? `${task.issuer.lastName} ${task.issuer.firstName[0]}.`
              : "Неизвестный отправитель"}
          </div>
          <ArrowRightShort style={{ fontSize: "1.5rem", color: "#333" }} />
          <div
            style={{
              border: "1px solid #ddd",
              padding: "8px 12px",
              borderRadius: "6px",
              fontWeight: "500",
              fontSize: "1rem",
              marginLeft: "10px",
              textAlign: "center",
              minWidth: "150px",
            }}
          >
            {task.receiver
              ? `${task.receiver.lastName} ${task.receiver.firstName[0]}.`
              : "Неизвестный получатель"}
          </div>
        </div>
        <div
          style={{
            fontWeight: "bold",
            fontSize: "1rem",
            marginTop: "10px",
          }}
        >
          {task.content}
        </div>
        <div
          style={{
            fontSize: "0.875rem",
            color: "#555",
            textAlign: "center",
          }}
        >
          {task.description.length > 30
            ? `${task.description.substring(0, 30)}...`
            : task.description}
        </div>
      </div>

      {/* Блок с статусом и датами */}
      <div
        className="text-center mx-3"
        style={{
          flex: "0 0 15%",
          textAlign: "center",
          minWidth: "150px",
        }}
      >
        <div
          style={{
            fontSize: "1rem",
            fontWeight: "bold",
            border: "1px solid #ddd",
            borderRadius: "6px",
            padding: "5px 10px",
            color: "#333",
            textAlign: "center",
            marginBottom: "5px",
          }}
        >
          {task.status} {currentStatusDate}
        </div>
        <div
          style={{
            fontSize: "0.875rem",
            color: "#555",
            textAlign: "center",
          }}
        >
          Завершение: {formatDate(task.endDate)}
        </div>
      </div>

      {/* Блок с объектом и разделом */}
      <div
        className="mx-3"
        style={{
          flex: "1",
          textAlign: "center",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
          {task.building.number} - {task.building.name}
        </div>
        <div style={{ fontSize: "0.875rem", color: "#555" }}>
          {task.section ? task.section.sectionName : "-"}
        </div>
      </div>

      {/* Блок с кнопками */}
      <div className="d-flex align-items-center" style={{ flex: "0 0 10%", justifyContent: "end" }}>
        {/* Кнопка "Редактировать" доступна всем */}
        <Button
          variant="outline-secondary"
          className="me-2"
          onClick={() => onEditClick(task)}
        >
          <PencilFill />
        </Button>

        {/* Кнопка "Удалить" доступна только автору задачи (issuer) */}

        <Button variant="outline-danger" onClick={() => onDeleteClick(task)}>
          <TrashFill />
        </Button>
      </div>
    </ListGroup.Item>
  );
};

export default TaskListItem;
