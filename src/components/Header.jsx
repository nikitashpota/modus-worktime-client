import React from "react";
import { Container, Navbar, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../services/AuthContext"; // Используйте контекст аутентификации
import "./Header.css";

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container fluid>
        <Navbar.Brand className="text-white" style={{ userSelect: "none" }}>
          <img
            src="/logo.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="MODUS logo"
          />
          MODUS Work Time
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
