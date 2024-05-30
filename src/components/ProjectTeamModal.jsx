import React from "react";
import { Modal, Button, ListGroup, Row, Col, Container } from "react-bootstrap";

const ProjectTeamModal = ({ show, onHide, teamMembers }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Состав проектной группы</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {Object.keys(teamMembers).length === 0 ? (
          <p>Нет данных о пользователях</p>
        ) : (
          <Container>
            {Object.entries(teamMembers).map(([department, users]) => (
              <Row
                key={department}
                className="mb-3"
                style={{
                  border: "1px solid #dee2e6",
                  borderRadius: "6px",
                  padding: "10px",
                }}
              >
                <Col md={2}>
                  <p>{department}</p>
                </Col>
                <Col md={8}>
                  <ListGroup variant="flush">
                    {users.map((user) => (
                      <ListGroup.Item key={user.id}>
                        {user.lastName} {user.firstName}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Col>
              </Row>
            ))}
          </Container>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Закрыть
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProjectTeamModal;
