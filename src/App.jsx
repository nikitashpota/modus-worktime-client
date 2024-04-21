import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import EmployeeView from "./views/EmployeeView";
import ManagerView from "./views/ManagerView";
import DirectorDashboard from "./views/DirectorDashboard";
import LoginForm from "./views/LoginForm";
import RegistrationForm from "./views/RegistrationForm";
import ProfileEdit from "./views/ProfileEdit";
import { AuthProvider } from "./services/AuthContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { ChevronCompactLeft } from "react-bootstrap-icons";
import { ChevronCompactRight } from "react-bootstrap-icons";
import BuildingPage from "./views/BuildingPage";

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <Router>
      <AuthProvider>
        <div className="App d-flex flex-column" style={{ minHeight: "100vh" }}>
          <Header />
          <div className="d-flex flex-row flex-grow-1">
            <div
              className={`sidebar-section d-flex flex-column ${
                isSidebarCollapsed ? "collapsed" : ""
              }`}
              style={{ minWidth: isSidebarCollapsed ? "66px" : "200px" }}
            >
              <Sidebar isCollapsed={isSidebarCollapsed} />
            </div>
            <button
              onClick={toggleSidebar}
              className="sidebar-toggle"
              aria-label="Toggle sidebar"
            >
              {isSidebarCollapsed ? (
                <ChevronCompactRight />
              ) : (
                <ChevronCompactLeft />
              )}
            </button>
            <div
              className="main-content flex-grow-1"
              style={{ overflowY: "auto" }}
            >
              <Routes>
                <Route path="/" element={<EmployeeView />} />
                <Route path="/building" element={<ManagerView />} />
                <Route path="/director" element={<DirectorDashboard />} />
                <Route path="/auth" element={<LoginForm />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/profile-edit" element={<ProfileEdit />} />
                <Route
                  path="/building/:buildingId"
                  element={<BuildingPage />}
                />
              </Routes>
            </div>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
