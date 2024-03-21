import React, { useState, useEffect } from "react";
import { Modal, Button, ListGroup, Form } from "react-bootstrap";
import axios from "axios";

const AssignUserModal = ({ show, onHide, objectId, apiUrl }) => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");

  // Загрузка списка пользователей
  useEffect(() => {
    if (show) {
      const fetchUsers = async () => {
        try {
          const response = await axios.get(`${apiUrl}/users`);
          setUsers(response.data);
        } catch (error) {
          console.error("Ошибка при загрузке списка пользователей:", error);
        }
      };
      fetchUsers();
    }
  }, [show, apiUrl]);

  // Функция для назначения пользователя
  const handleAssignUser = async (userId) => {
    try {
      await axios.post(`${apiUrl}/assign-user`, { userId, objectId });
      onHide(); // Закрываем модальное окно после успешного назначения
    } catch (error) {
      console.error("Ошибка при назначении пользователя:", error);
    }
  };

  // Фильтрация списка пользователей на основе введенного текста
  const filteredUsers = users.filter((user) =>
    `${user.lastName} ${user.firstName}`
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Назначить пользователя</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Поиск по Фамилии и Имени..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </Form.Group>
        <ListGroup>
          {filteredUsers.map((user) => (
            <ListGroup.Item
              key={user.id}
              className="d-flex justify-content-between align-items-center"
            >
              {`${user.lastName} ${user.firstName[0]}. - ${user.department}`}
              <Button
                variant="primary"
                onClick={() => handleAssignUser(user.id)}
              >
                Назначить
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Закрыть
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AssignUserModal;
