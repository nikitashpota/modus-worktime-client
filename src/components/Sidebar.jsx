import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import {
  Hourglass,
  Buildings,
  Grid3x3,
  Person,
  People,
  PiggyBank
} from "react-bootstrap-icons"; // Импортируйте нужные иконки
import "./Sidebar.css"; // Предполагается, что стили будут в этом файле

const SidebarItem = ({ to, icon, children, isCollapsed }) => (
  <Nav.Item className={isCollapsed ? "text-center" : ""}>
    <Nav.Link
      as={Link}
      to={to}
      eventKey={to}
      className="d-flex align-items-center"
    >
      <div className="sidebar-icon">{icon}</div>
      {!isCollapsed && <span className="ms-2">{children}</span>}
    </Nav.Link>
  </Nav.Item>
);

const Sidebar = ({ isCollapsed }) => {
  const { userRole } = useAuth();

  return (
    <Nav
      variant="pills"
      className={`flex-column bg-light sidebar ${
        isCollapsed ? "collapsed" : ""
      }`}
    >
      <SidebarItem
        to="/"
        icon={<Hourglass size={20} />}
        isCollapsed={isCollapsed}
      >
        Работа
      </SidebarItem>

      <SidebarItem
        to="/building"
        icon={<Buildings size={20} />}
        isCollapsed={isCollapsed}
      >
        Объекты
      </SidebarItem>

      <SidebarItem
        to="/director"
        icon={<Grid3x3 size={20} />}
        isCollapsed={isCollapsed}
      >
        Отчеты
      </SidebarItem>

      <SidebarItem
        icon={<PiggyBank size={20} />}//{<img src="/rub.svg" width="26" height="26" alt="rub" />}
        isCollapsed={isCollapsed}
        to="/financial-reports"
        
      >
        Финансы
      </SidebarItem>

      <SidebarItem
        icon={<People size={20} />}
        isCollapsed={isCollapsed}
        to="/user-management"
      >
        Персонал
      </SidebarItem>
      <SidebarItem
        to="/profile-edit"
        icon={<Person size={20} />}
        isCollapsed={isCollapsed}
      >
        Профиль
      </SidebarItem>
    </Nav>
  );
};

export default Sidebar;
