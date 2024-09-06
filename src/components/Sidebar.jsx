import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
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
import "./Sidebar.css";

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

const SidebarSubItem = ({ to, icon, children, isCollapsed }) => (
  <Nav.Item>
    <Nav.Link
      as={Link}
      to={to}
      eventKey={to}
      className={
        isCollapsed
          ? `d-flex align-items-center justify-content-end`
          : `d-flex align-items-center`
      }
    >
      {isCollapsed && <div style={{}}>{icon}</div>}
      {!isCollapsed && <span className="ms-2">{children}</span>}
    </Nav.Link>
  </Nav.Item>
);

const Sidebar = ({ isCollapsed }) => {
  const { userRole } = useAuth();
  const [isWorkMenuOpen, setWorkMenuOpen] = useState(false);

  const toggleWorkMenu = () => setWorkMenuOpen(!isWorkMenuOpen);

  return (
    <Nav
      variant="pills"
      className={`flex-column bg-light sidebar ${
        isCollapsed ? "collapsed" : ""
      }`}
    >
      {/* Основной элемент "Работа" */}
      <Nav.Item className={isCollapsed ? "text-center" : ""}>
        <Nav.Link
          onClick={toggleWorkMenu}
          className="d-flex align-items-center"
        >
          <div className="sidebar-icon">
            <Hourglass size={20} />
          </div>
          {!isCollapsed && <span className="ms-2">Работа</span>}
          {!isCollapsed && (
            <div className="ms-auto">
              {isWorkMenuOpen ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </div>
          )}
        </Nav.Link>
      </Nav.Item>

      {/* Подвкладки под "Работа" */}
      {isWorkMenuOpen && (
        <>
          <SidebarSubItem
            to="/work-time"
            icon={"У-Р"}
            isCollapsed={isCollapsed}
          >
            Учет работы
          </SidebarSubItem>
          <SidebarSubItem
            to="/task-view"
            icon={"З-Д"}
            isCollapsed={isCollapsed}
          >
            Задания
          </SidebarSubItem>
        </>
      )}

      {/* Другие пункты меню */}
      <SidebarItem
        to="/building"
        icon={<Buildings size={20} />}
        isCollapsed={isCollapsed}
      >
        Объекты
      </SidebarItem>
      <SidebarItem
        to="/director"
        icon={<ClipboardData size={20} />}
        isCollapsed={isCollapsed}
      >
        Отчеты
      </SidebarItem>
      <SidebarItem
        to="/financial-reports"
        icon={<PiggyBank size={20} />}
        isCollapsed={isCollapsed}
      >
        Финансы
      </SidebarItem>
      <SidebarItem
        to="/user-management"
        icon={<People size={20} />}
        isCollapsed={isCollapsed}
      >
        Персонал
      </SidebarItem>

      <div style={{ justifySelf: "end" }}>
        <SidebarItem
          to="/profile-edit"
          icon={<Person size={20} />}
          isCollapsed={isCollapsed}
        >
          Профиль
        </SidebarItem>
      </div>
    </Nav>
  );
};

export default Sidebar;
