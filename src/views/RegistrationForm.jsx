import React, { useState } from "react";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "../services/axios";
import departments from "../services/departmentsData";

function RegistrationForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [department, setDepartment] = useState("");

  const navigate = useNavigate(); // Для перенаправления пользователя после регистрации

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Отправка данных на сервер
      await axios.post("/users/register", {
        username,
        email,
        password,
        role,
        firstName,
        lastName,
        department,
      });
      alert("Регистрация прошла успешно");
      navigate("/auth"); // Перенаправление на страницу входа
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      if (error.response) {
        // Сервер вернул код ошибки, отличный от 2xx
        alert(`Ошибка: ${error.response.data.message}`);
      } else {
        alert("Ошибка при регистрации");
      }
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100%" }}
    >
      <Row>
        <Col>
          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title className="text-center mb-4">Регистрация</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>Логин</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Введите логин"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Введите Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Пароль</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Пароль..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicFirstName">
                  <Form.Label>Имя</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Введите имя"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicLastName">
                  <Form.Label>Фамилия</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Введите фамилию"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicRole">
                  <Form.Label>Роль</Form.Label>
                  <Form.Select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="">Выберите роль...</option>
                    <option value="Проектировщик">Проектировщик</option>
                    <option value="ГИП">ГИП</option>
                  </Form.Select>
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

                <Button variant="primary" type="submit" className="w-100 mb-2">
                  Зарегистрироваться
                </Button>
                <Button
                  variant="secondary"
                  className="w-100"
                  as={Link}
                  to="/auth"
                >
                  Вход
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default RegistrationForm;
