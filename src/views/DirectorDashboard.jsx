import { useState, useEffect } from "react";
import axios from "../services/axios";
import { Tabs, Tab, Row, Col, Nav } from "react-bootstrap";
import WorkLogSummaryTable from "../components/WorkLogSummaryTable";
import EmployeeWorkloadTable from "../components/EmployeeWorkloadTable";
import ProjectOverview from "../components/ProjectOverview";
import DepartmentHoursChart from "../components/DepartmentHoursChart";
// Импортируйте другие таблицы и компоненты графиков, которые вы планируете использовать

// Загрузка данных

const DirectorDashboard = () => {
  const [users, setUsers] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [workTimeLogs, setWorkTimeLogs] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get("/users");
      // console.log("users", data);
      setUsers(data);
    };

    const fetchBuildings = async () => {
      const { data } = await axios.get("/buildings");
      // console.log("buildings", data);
      setBuildings(data);
    };

    const fetchWorkTimeLogs = async () => {
      const { data } = await axios.get("/workTimeLogs");
      // console.log("workTimeLogs", data);
      setWorkTimeLogs(data);
    };

    fetchUsers();
    fetchBuildings();
    fetchWorkTimeLogs();
  }, []);

  return (
    <Tabs
      defaultActiveKey="workLogSummaryTable"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
      <Tab eventKey="workLogSummaryTable" title="День-час">
        <WorkLogSummaryTable />
      </Tab>
      <Tab eventKey="employeeWorkloadTable" title="Объект-проценты">
        <EmployeeWorkloadTable
          users={users}
          buildings={buildings}
          workTimeLogs={workTimeLogs}
        />
      </Tab>
      <Tab eventKey="erojectOverview" title="Польз.-задачи">
        <ProjectOverview
          users={users}
          buildings={buildings}
          workTimeLogs={workTimeLogs}
        />
      </Tab>
      <Tab eventKey="departmentHoursChart" title="Отдел-часы">
        <DepartmentHoursChart
          users={users}
          buildings={buildings}
          workTimeLogs={workTimeLogs}
        />
      </Tab>
    </Tabs>
    // <Tab.Container id="top-tabs-example" defaultActiveKey="first">
    //   <Row>
    //     <Col sm={2}>
    //       <Nav variant="pills" className="flex-column">
    //         <Nav.Item>
    //           <Nav.Link eventKey="first">Ведомость дней-часов</Nav.Link>
    //         </Nav.Item>
    //         <Nav.Item>
    //           <Nav.Link eventKey="second">Ведомость объектов</Nav.Link>
    //         </Nav.Item>
    //         <Nav.Item>
    //           <Nav.Link eventKey="third">Пользователь-задачи</Nav.Link>
    //         </Nav.Item>
    //         <Nav.Item>
    //           <Nav.Link eventKey="fourth">Отдел-часы</Nav.Link>
    //         </Nav.Item>
    //       </Nav>
    //     </Col>
    //     <Col sm={9}>
    //       <Tab.Content>
    //         <Tab.Pane eventKey="first">
    //           <WorkLogSummaryTable />
    //         </Tab.Pane>
    //         <Tab.Pane eventKey="second">
    //           <EmployeeWorkloadTable
    //             users={users}
    //             buildings={buildings}
    //             workTimeLogs={workTimeLogs}
    //           />
    //         </Tab.Pane>
    //         <Tab.Pane eventKey="third">

    //           />
    //         </Tab.Pane>
    //         <Tab.Pane eventKey="fourth">
    //           <DepartmentHoursChart
    //             users={users}
    //             buildings={buildings}
    //             workTimeLogs={workTimeLogs}
    //           />
    //         </Tab.Pane>
    //         {/* Добавьте другие Tab.Pane для каждой таблицы или графика */}
    //       </Tab.Content>
    //     </Col>
    //   </Row>
    // </Tab.Container>
  );
};

export default DirectorDashboard;
