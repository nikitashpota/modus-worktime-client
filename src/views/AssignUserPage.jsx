import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, ListGroup, Form } from "react-bootstrap";
import axios from "../services/axios";

const AssignUserPage = () => {
  const { buildingId } = useParams();
  const [building, setBuilding] = useState(null);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [assignedUserIds, setAssignedUserIds] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Здесь ваш API URL для получения списка пользователей
        const response = await axios.get(`/users`);
        setUsers(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке списка пользователей:", error);
      }
    };
    fetchUsers();

    const fetchAssignedUsers = async () => {
      try {
        const response = await axios.get(
          `/buildings/${buildingId}/assigned-users`
        );
        // Обработка полученных данных...
        setAssignedUserIds(response.data.map((user) => user.id));
      } catch (error) {
        console.error("Ошибка при загрузке назначенных пользователей:", error);
      }
    };

    fetchAssignedUsers();

    const fetchBuilding = async () => {
      try {
        // Загрузка данных о здании
        const response = await axios.get(`/buildings/${buildingId}`);
        setBuilding(response.data); // Сохраняем полученные данные о здании
      } catch (error) {
        console.error("Ошибка при загрузке данных о здании:", error);
      }
    };

    fetchBuilding();
  }, [buildingId]);

  // Функция для назначения пользователя
  const handleAssignUser = async (userId) => {
    if (assignedUserIds.includes(userId)) {
      // Отправить запрос на удаление пользователя из здания
      try {
        await axios.post(`/buildings/unassign-user`, { userId, buildingId });
        setAssignedUserIds(assignedUserIds.filter((id) => id !== userId));
      } catch (error) {
        console.error("Ошибка при удалении назначения пользователя:", error);
      }
    } else {
      // Отправить запрос на назначение пользователя к зданию
      try {
        await axios.post(`/buildings/assign-user`, { userId, buildingId });
        setAssignedUserIds([...assignedUserIds, userId]);
      } catch (error) {
        console.error("Ошибка при назначении пользователя:", error);
      }
    }
  };

  // Фильтрация списка пользователей
  const filteredUsers = users.filter((user) =>
    `${user.lastName} ${user.firstName}`
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  const sortedAndFilteredUsers = filteredUsers.sort((a, b) => {
    // Сравниваем строки в формате "Фамилия Имя", чтобы сначала шла сортировка по фамилии, а потом по имени
    const fullNameA = `${a.lastName} ${a.firstName}`.toLowerCase();
    const fullNameB = `${b.lastName} ${b.firstName}`.toLowerCase();

    if (fullNameA < fullNameB) return -1;
    if (fullNameA > fullNameB) return 1;
    return 0; // Если имена полностью совпадают, порядок не меняется
  });

  return (
    <div>
      <h2>Добавить исполнителя</h2>
      {building && (
        <>
          <h4>{`Объект: ${building.number} - ${building.name}`}</h4>
          <p>{building.description}</p>
        </>
      )}
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Поиск по Фамилии и Имени..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </Form.Group>
      <ListGroup>
        {sortedAndFilteredUsers.map((user) => (
          <ListGroup.Item
            key={user.id}
            className="d-flex justify-content-between align-items-center"
          >
            {`${user.lastName} ${user.firstName[0]}. - ${user.department}`}
            <Button
              style={{ width: "100px" }}
              variant={assignedUserIds.includes(user.id) ? "danger" : "primary"}
              onClick={() => handleAssignUser(user.id)}
            >
              {assignedUserIds.includes(user.id) ? "Отменить" : "Назначить"}
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default AssignUserPage;
