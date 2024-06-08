import { useState, useEffect } from "react";
import axios from "../services/axios";
import { Tabs, Tab } from "react-bootstrap";
import WorkLogSummaryTable from "../components/WorkLogSummaryTable";
import EmployeeWorkloadTable from "../components/EmployeeWorkloadTable";
import ProjectOverview from "../components/ProjectOverview";
import DepartmentHoursChart from "../components/DepartmentHoursChart";
import OverlappingSectionsChart from "../components/OverlappingSectionsChart";
import "./DirectorDashboard.css"; // Подключение CSS

const DirectorDashboard = () => {
  const [users, setUsers] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [sections, setSections] = useState([]);
  const [workTimeLogs, setWorkTimeLogs] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get("/users");
      setUsers(data);
    };

    const fetchBuildings = async () => {
      const { data } = await axios.get("/buildings");
      setBuildings(data);
    };

    const fetchSections = async () => {
      const { data } = await axios.get("/sections");
      setSections(data);
    };

    const fetchWorkTimeLogs = async () => {
      const { data } = await axios.get("/workTimeLogs");
      setWorkTimeLogs(data);
    };

    fetchUsers();
    fetchBuildings();
    fetchWorkTimeLogs();
    fetchSections();
  }, []);

  return (
    <Tabs
      defaultActiveKey="workLogSummaryTable"
      id="uncontrolled-tab-example"
      className="mb-3 custom-tabs"
    >
      <Tab
        eventKey="workLogSummaryTable"
        title="Таблица дней-часов"
        className="custom-tab"
      >
        <WorkLogSummaryTable />
      </Tab>
      <Tab
        eventKey="employeeWorkloadTable"
        title="Таблица объектов (%)"
        className="custom-tab"
      >
        <EmployeeWorkloadTable
          users={users}
          buildings={buildings}
          workTimeLogs={workTimeLogs}
        />
      </Tab>
      <Tab
        eventKey="projectOverview"
        title="Таблица задач (польз.)"
        className="custom-tab"
      >
        <ProjectOverview
          users={users}
          buildings={buildings}
          sections={sections}
          workTimeLogs={workTimeLogs}
        />
      </Tab>
      <Tab
        eventKey="departmentHoursChart"
        title="График часов (объекты)"
        className="custom-tab"
      >
        <DepartmentHoursChart
          users={users}
          buildings={buildings}
          workTimeLogs={workTimeLogs}
        />
      </Tab>
      <Tab
        eventKey="overlappingSectionsChart"
        title="График Ганта (Разделы)"
        className="custom-tab"
      >
        <OverlappingSectionsChart users={users} />
      </Tab>
    </Tabs>
  );
};

export default DirectorDashboard;
