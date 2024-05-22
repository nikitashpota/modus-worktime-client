import React, { useState } from "react";
import { Button, Form, Container, Card } from "react-bootstrap";
import axios from "../services/axios";
import { useParams, useNavigate } from "react-router-dom";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams(); // Извлечение токена из URL
  const navigate = useNavigate(); // Хук для перенаправления

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Пароли не совпадают.");
      return;
    }
    try {
      await axios.post("/users/reset-password", { token, password });
      alert("Ваш пароль успешно изменен.");
      navigate("/auth"); // Перенаправление на страницу входа
    } catch (error) {
      alert("Ошибка при изменении пароля.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100%" }}>
      <Card style={{ width: "100%", maxWidth: "500px" }}>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formPassword">
              <Form.Label>Новый пароль</Form.Label>
              <Form.Control
                type="password"
                placeholder="Введите новый пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formConfirmPassword">
              <Form.Label>Подтвердите пароль</Form.Label>
              <Form.Control
                type="password"
                placeholder="Подтвердите новый пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3" style={{width: "100%"}}>
              Изменить пароль
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ResetPasswordForm;
