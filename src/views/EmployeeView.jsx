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
      <TimeTable />
    </>
  );
};

export default EmployeeView;
