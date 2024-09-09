import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  Hourglass,
  Buildings,
  ClipboardData,
  Person,
  People,
  ChevronDown,
  ChevronUp,
  PiggyBank,
} from "react-bootstrap-icons";
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
        <h1 className="logo-title">GetWORK .</h1>
      </div>

      <Row className="g-4 justify-content-center">
        <Col md={4}>
          <Card>
            <Card.Body className="custom-card">
              <Card.Title>
                <Hourglass size={30} style={{ marginRight: "16px" }} />
                Учет рабочего времени
              </Card.Title>
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
          <Card>
            <Card.Body className="custom-card">
              <Card.Title>
                <Hourglass size={30} style={{ marginRight: "16px" }} />
                Задачи и управление
              </Card.Title>
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
          <Card>
            <Card.Body className="custom-card">
              <Card.Title>
                <Buildings size={30} style={{ marginRight: "16px" }} />
                Управление объектами
              </Card.Title>
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
          <Card>
            <Card.Body className="custom-card">
              <Card.Title>
                <ClipboardData size={30} style={{ marginRight: "16px" }} />
                Получить отчеты
              </Card.Title>
              <Card.Text>
                Просматривайте отчеты по задачам и загрузкам сотрудников.
                Скачивайте отчеты в табличной форме
              </Card.Text>
              <Button
                onClick={() => navigate("/director")}
                variant="outline-primary"
                className="card-button"
              >
                Открыть
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body className="custom-card">
              <Card.Title>
                <PiggyBank size={30} style={{ marginRight: "16px" }} />
                Управление финансами
              </Card.Title>
              <Card.Text>
                Просматривайте и управляйте даижением финансовых потоков.
              </Card.Text>
              <Button
                onClick={() => navigate("/financial-reports")}
                variant="outline-primary"
                className="card-button"
              >
                Открыть
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
