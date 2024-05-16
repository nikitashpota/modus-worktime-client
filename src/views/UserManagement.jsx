import { useState, useEffect } from "react";
import { Button, InputGroup, FormControl } from "react-bootstrap";
import { Trash, Save } from "react-bootstrap-icons";
import axios from "../services/axios";
import { useAuth } from "../services/AuthContext";
const UserManagement = () => {
  const { userRole } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (userRole === "Администратор") fetchUsers();
  }, []);

  if (userRole !== "Администратор")
    return (
      <h5
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "95%",
          textAlign: "center",
        }}
      >
        У вас нет прав. Пожалуйста, обратитесь к администратору для установления
        ролей.
      </h5>
    );

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/users");

      setUsers(
        response.data.sort((a, b) => {
          if (a.department != b.department) {
            return a.department.localeCompare(b.department);
          }
          if (a.lastName != b.lastName) {
            return a.lastName.localeCompare(b.lastName);
          }
          if (a.firstName != b.firstName) {
            return a.firstName.localeCompare(b.firstName);
          }
        })
      );
    } catch (error) {
      console.error("Ошибка при получении списка пользователей:", error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/user/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
    }
  };

  const handleUpdate = async (user) => {
    try {
      event.preventDefault();
      console.log(user);
      const { data } = await axios.put(`/users/user/${user.id}`, {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        department: user.department,
        role: user.role,
        salary: user.salary,
      });
      console.log("Profile updated successfully", data);
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const handleChange = (e, userId) => {
    const { name, value } = e.target;
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, [name]: value } : user
      )
    );
  };

  return (
    <div style={{ width: "100%" }}>
      <h5 className="mb-3">Список пользователей:</h5>
      {users.map((user) => (
        <InputGroup className="mb-3" key={user.id} style={{ width: "100%" }}>
          <FormControl
            placeholder="Фамилия"
            name="lastName"
            value={user.lastName}
            onChange={(e) => handleChange(e, user.id)}
          />
          <FormControl
            placeholder="Имя"
            name="firstName"
            value={user.firstName}
            onChange={(e) => handleChange(e, user.id)}
          />
          <FormControl
            placeholder="Email"
            name="email"
            value={user.email}
            onChange={(e) => handleChange(e, user.id)}
          />
          <FormControl
            placeholder="Роль"
            name="role"
            value={user.role}
            onChange={(e) => handleChange(e, user.id)}
          />
          <FormControl
            placeholder="Отдел"
            name="department"
            value={user.department}
            onChange={(e) => handleChange(e, user.id)}
          />
          <FormControl
            type="number"
            placeholder="Зарплата"
            name="salary"
            value={user.salary || 0}
            onChange={(e) => handleChange(e, user.id)}
          />
          <Button
            variant="outline-secondary"
            onClick={() => handleUpdate(user)}
          >
            <Save />
          </Button>
          <Button
            variant="outline-danger"
            onClick={() => handleDelete(user.id)}
          >
            <Trash />
          </Button>
        </InputGroup>
      ))}
    </div>
  );
};

export default UserManagement;
