import React from "react";
import { Tab, Row, Col, Nav } from "react-bootstrap";
import WorkLogSummaryTable from "../components/WorkLogSummaryTable";
import EmployeeWorkloadTable from "../components/EmployeeWorkloadTable";
import ProjectOverview from "../components/ProjectOverview";
// Импортируйте другие таблицы и компоненты графиков, которые вы планируете использовать

const DirectorDashboard = () => {
  return (
    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
      <Row>
        <Col sm={2}>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey="first">Ведомость дней-часов</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="second">Ведомость объектов</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="third">Пользователь-задачи</Nav.Link>
            </Nav.Item>
            {/* Добавьте другие Nav.Item с соответствующими Nav.Link для каждой таблицы или графика */}
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content>
            <Tab.Pane eventKey="first">
              <WorkLogSummaryTable />
            </Tab.Pane>
            <Tab.Pane eventKey="second">
              <EmployeeWorkloadTable />
            </Tab.Pane>
            <Tab.Pane eventKey="third">
              <ProjectOverview />
            </Tab.Pane>
            {/* Добавьте другие Tab.Pane для каждой таблицы или графика */}
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
};

export default DirectorDashboard;
