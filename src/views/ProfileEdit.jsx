// Пример файла ProfileEdit.jsx
import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import axios from "../services/axios";
import { useAuth } from "../services/AuthContext";
import departments from "../services/departmentsData";

function ProfileEdit() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");

  // Продолжите добавлять состояния по мере необходимости

  const { userId } = useAuth(); 
  useEffect(() => {
    // Загрузите данные профиля пользователя при монтировании компонента
    if (userId) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`/users/user/${userId}`);
          // Предполагая, что API возвращает данные пользователя
          setFirstName(response.data.firstName);
          setLastName(response.data.lastName);
          setEmail(response.data.email);
          setDepartment(response.data.department);
        } catch (error) {
          console.error("Ошибка при загрузке данных профиля:", error);
        }
      };

      fetchData();
    }
  }, [userId]);

  const handleSubmit = async (event) => {
    if (userId) {
      event.preventDefault();
      try {
        // Отправьте обновленные данные профиля на сервер
        await axios.put(`/users/user/${userId}`, {
          firstName,
          lastName,
          email,
          department,
        });
        alert("Профиль обновлен успешно");
      } catch (error) {
        console.error("Ошибка при обновлении профиля:", error);
      }
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Редактирование профиля</Card.Title>
        <Form onSubmit={handleSubmit}>
          {/* Имя */}
          <Form.Group className="mb-3" controlId="formFirstName">
            <Form.Label>Имя</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите ваше имя"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </Form.Group>

          {/* Фамилия */}
          <Form.Group className="mb-3" controlId="formLastName">
            <Form.Label>Фамилия</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите вашу фамилию"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Введите ваш email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicDepartment">
            <Form.Label>Отдел</Form.Label>
            <Form.Select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            >
              <option value="">Выберите отдел...</option>
              {departments.map((dept) => (
                <option key={dept.Code} value={dept.Code}>
                  {dept.Name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit">
            Обновить профиль
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default ProfileEdit;
