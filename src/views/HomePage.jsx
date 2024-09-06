import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./HomePage.css"; // CSS для анимации и стилей

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Container className="mt-5 text-center">
      {/* Логотип с анимацией */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          placeContent: "center",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "52px",
        }}
      >
        <div className="logo-container">
          <div className="logo-strip"></div>
          <div className="logo-strip"></div>
          <div className="logo-strip"></div>
          <div className="logo-strip"></div>
          <div className="logo-strip"></div>
          <div className="logo-strip"></div>
        </div>
        <h1 className="logo-title">MODUS Work Time</h1>
      </div>

      <Row className="g-4 justify-content-center">
        <Col md={4}>
          <Card className="custom-card">
            <Card.Body>
              <Card.Title>Учет рабочего времени</Card.Title>
              <Card.Text>
                Управляйте временем сотрудников, отслеживайте их рабочие часы.
              </Card.Text>
              <Button
                onClick={() => navigate("/work-time")}
                variant="outline-primary"
                className="card-button"
              >
                Открыть
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="custom-card">
            <Card.Body>
              <Card.Title>Задачи и управление</Card.Title>
              <Card.Text>
                Управляйте задачами, выданными сотрудникам, следите за статусом
                выполнения.
              </Card.Text>
              <Button
                onClick={() => navigate("/task-view")}
                variant="outline-primary"
                className="card-button"
              >
                Открыть
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="custom-card">
            <Card.Body>
              <Card.Title>Управление объектами</Card.Title>
              <Card.Text>
                Просматривайте и управляйте объектами строительства.
              </Card.Text>
              <Button
                onClick={() => navigate("/building")}
                variant="outline-primary"
                className="card-button"
              >
                Открыть
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="custom-card">
            <Card.Body>
              <Card.Title>Получить отчеты</Card.Title>
              <Card.Text>
                Просмотреть отчеты по задачам и загрузки сотрудников. Скачать отчеты в табличной форме
              </Card.Text>
              <Button
                onClick={() => navigate("/building")}
                variant="outline-primary"
                className="card-button"
              >
                Открыть
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="custom-card">
            <Card.Body>
              <Card.Title>Управление объектами</Card.Title>
              <Card.Text>
                Просматривайте и управляйте объектами строительства.
              </Card.Text>
              <Button
                onClick={() => navigate("/building")}
                variant="outline-primary"
                className="card-button"
              >
                Открыть
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Добавь больше карточек по аналогии */}
      </Row>
    </Container>
  );
};

export default HomePage;
