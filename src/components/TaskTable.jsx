import React from "react";
import { Table, Button } from "react-bootstrap";

const formatDate = (dateString) => {
  const options = { day: "2-digit", month: "2-digit", year: "2-digit" };
  return new Date(dateString).toLocaleDateString("ru-RU", options);
};

const TaskTable = ({ tasks, onEditClick }) => {
  return (
    <Table striped bordered hover className="thin-header" responsive="sm">
      <thead>
        <tr>
          <th>Задание от</th>
          <th>Задание кому</th>
          <th>Раздел</th>
          <th>Наименование задачи</th>
          <th className="column__width-300">Описание задачи</th>
          <th>Начало выполнения</th>
          <th>Конец выполнения</th>
          <th>Статус</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td>
              {task.issuer
                ? `${task.issuer.firstName} ${task.issuer.lastName} (${task.issuer.department})`
                : "Неизвестный отправитель"}
            </td>
            <td>
              {task.receiver
                ? `${task.receiver.firstName} ${task.receiver.lastName} (${task.receiver.department})`
                : "Неизвестный получатель"}
            </td>
            <td>
              {task.section
                ? `${task.building.number} - ${task.section.stage} - ${task.section.sectionCode}`
                : `${task.building?.number}`}
            </td>
            <td>{task.content}</td>
            <td className="column__width-300">{task.description}</td>
            <td className="column__text-center">
              {formatDate(task.startDate)}
            </td>
            <td className="column__text-center">{formatDate(task.endDate)}</td>
            <td>{task.status}</td>
            <td className="column__text-center">
              <Button variant="warning" onClick={() => onEditClick(task)}>
                Редактировать
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TaskTable;
