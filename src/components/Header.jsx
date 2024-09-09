import { useEffect } from "react";
import { Container, Navbar, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../services/AuthContext"; // Используйте контекст аутентификации
import "./Header.css";
import axios from "../services/axios";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { isAuthenticated, logout, userId, userRole, setUserRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) fetchUserRole();
  }, [userId]);

  const fetchUserRole = async () => {
    try {
      const response = await axios.get(`/users/user/${userId}`);
      const role = response.data.role;
      if (role && userRole !== role) {
        localStorage.setItem("role", role);
        setUserRole(role);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Navbar expand="lg" className="custom-navbar fixed-top">
      <Container fluid>
        <Navbar.Brand
          className="text-white"
          style={{ userSelect: "none", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <img
            src="/logo.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="MODUS logo"
          />
          GetWORK <span style={{ fontSize: "20px" }}>.</span>{" "}
        </Navbar.Brand>
        {isAuthenticated ? (
          <Button
            style={{ width: "100px" }}
            onClick={logout}
            variant="outline-primary"
            className="text-white"
          >
            Выход
          </Button>
        ) : (
          <Link
            style={{ width: "100px" }}
            to="/auth"
            className="btn btn-outline-primary text-white"
          >
            Вход
          </Link>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
