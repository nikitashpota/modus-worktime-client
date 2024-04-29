import { useState } from "react";
import { Form, Button, Card, Container, Row, Col, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "../services/axios";
import { useAuth } from "../services/AuthContext"; // Используйте контекст аутентификации
import { EyeSlash, Eye } from "react-bootstrap-icons"; 

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    // console.log("login start");
    event.preventDefault();
    // console.log("login password", username, password);
    try {
      const response = await axios.post("/users/login", {
        username,
        password,
      });

      // Сохраняем полученный токен в localStorage
      login(response.data.token, response.data.role, response.data.id);
      console.log(response.data.role, response.data.id);

      navigate("/");
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Произошла ошибка при попытке входа");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
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
              <Card.Title className="text-center mb-4">Вход</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>Логин</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  {/* <Form.Label>Пароль</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  /> */}
                  <Form.Label>Пароль</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={passwordVisible ? "text" : "password"}
                      placeholder="Пароль"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <InputGroup.Text onClick={togglePasswordVisibility}>
                      {passwordVisible ? <EyeSlash /> : <Eye />}
                    </InputGroup.Text>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    <Link to="/reset-password">Forgot password?</Link>
                  </Form.Text>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mb-2">
                  Вход
                </Button>
                <Button
                  variant="secondary"
                  className="w-100"
                  as={Link}
                  to="/register"
                >
                  Зарегистрироваться
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginForm;
