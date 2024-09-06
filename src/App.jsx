import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import EmployeeView from "./views/EmployeeView";
import ManagerView from "./views/ManagerView";
import DirectorDashboard from "./views/DirectorDashboard";
import LoginForm from "./views/LoginForm";
import RegistrationForm from "./views/RegistrationForm";
import ProfileEdit from "./views/ProfileEdit";
import PasswordResetRequest from "./views/PasswordResetRequest";
import ResetPasswordForm from "./views/ResetPasswordForm";
import { AuthProvider } from "./services/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import BuildingPage from "./views/BuildingPage";
import UserManagement from "./views/UserManagement";
import FinancialReports from "./views/FinancialReports";
import BrokenLine from "./components/BrokenLine";
import TaskManagement from "./views/TaskManagement";
import HomePage from "./views/HomePage";

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
          <div
            className="d-flex flex-row flex-grow-1"
            style={{ marginTop: "56px" }}
          >
            <div
              className={`sidebar-section d-flex flex-column ${
                isSidebarCollapsed ? "collapsed" : ""
              }`}
              style={{ position: "fixed", top: "56px", bottom: 0 }}
            >
              <Sidebar isCollapsed={isSidebarCollapsed} />
            </div>
            {/* <button
              className={`sidebar-toggle ${
                isSidebarCollapsed ? "collapsed" : ""
              }`}
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            > 
            */}
            <BrokenLine
              isCollapsed={isSidebarCollapsed}
              top="50%"
              left={isSidebarCollapsed ? "57px" : "190px"}
              toggleSidebar={toggleSidebar}
            />
            <div
              className={`main-content flex-grow-1 ${
                isSidebarCollapsed ? "collapsed-content" : ""
              }`}
              style={{
                marginLeft: isSidebarCollapsed ? "67px" : "200px",
                overflowY: "auto",
                paddingTop: "16px",
              }}
            >
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/work-time" element={<EmployeeView />} />
                <Route path="/task-view" element={<TaskManagement />} />
                <Route path="/building" element={<ManagerView />} />
                <Route path="/director" element={<DirectorDashboard />} />
                <Route path="/auth" element={<LoginForm />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/profile-edit" element={<ProfileEdit />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route
                  path="/reset-password/:token"
                  element={<ResetPasswordForm />}
                />
                <Route
                  path="/reset-password"
                  element={<PasswordResetRequest />}
                />
                <Route
                  path="/financial-reports"
                  element={<FinancialReports />}
                />
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
