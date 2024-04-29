import React, { useState, useEffect } from "react";
import { Card, ListGroup } from "react-bootstrap";
import axios from "../services/axios"; // Путь к вашему файлу с настроенным axios
import { useAuth } from "../services/AuthContext"; // Путь к вашему AuthContext
import TimeTable from "../components/TimeTable";


const EmployeeView = () => {
  // user - это объект с информацией о пользователе, например:
  const { userId } = useAuth();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const response = await axios.get(`/users/user/${userId}`);
          const { firstName, lastName, email, department } = response.data;
          setUser({ firstName, lastName, email, department });
        } catch (error) {
          console.error("Ошибка при загрузке данных профиля:", error);
        }
      }
    };

    fetchUserData();
  }, [userId]);
  return (
    <>
      {/* <div style={{ marginBottom: "16px" }}>
        <p style={{ fontWeight: "500" }}>Профиль пользователя:</p>
        <Card style={{ width: "18rem", marginBottom: "16px" }}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              Имя: {`${user.lastName} ${user.firstName}`}
            </ListGroup.Item>
            <ListGroup.Item>Отдел: {user.department}</ListGroup.Item>
            <ListGroup.Item>Email: {user.email}</ListGroup.Item>
          </ListGroup>
        </Card>
      </div> */}
      <div>
        {/* <p style={{ fontWeight: "500" }}>Учет времени:</p> */}
        <TimeTable />
      </div>
    </>
  );
};

export default EmployeeView;
