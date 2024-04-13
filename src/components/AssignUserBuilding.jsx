import React, { useState, useEffect } from "react";
import { Button, ListGroup, Form, Accordion } from "react-bootstrap";
import axios from "../services/axios";
import departmentsData from "../services/departmentsData"; // Импортируем данные отделов
import "./AssignUserBuilding.css";

const AssignUserBuilding = ({ building }) => {
  const buildingId = building.id;
  const [users, setUsers] = useState([]);
  const [assignedUserIds, setAssignedUserIds] = useState([]);

  useEffect(() => {
    const fetchUsersAndAssignments = async () => {
      try {
        const usersResponse = await axios.get(`/users`);
        const assignedResponse = await axios.get(
          `/buildings/${buildingId}/assigned-users`
        );
        setUsers(usersResponse.data);
        setAssignedUserIds(assignedResponse.data.map((user) => user.id));
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchUsersAndAssignments();
  }, [buildingId]);

  const handleAssignUser = async (userId) => {
    try {
      if (assignedUserIds.includes(userId)) {
        await axios.post(`/buildings/unassign-user`, { userId, buildingId });
        setAssignedUserIds(assignedUserIds.filter((id) => id !== userId));
      } else {
        await axios.post(`/buildings/assign-user`, { userId, buildingId });
        setAssignedUserIds([...assignedUserIds, userId]);
      }
    } catch (error) {
      console.error("Ошибка при назначении или удалении пользователя:", error);
    }
  };

  const renderUserList = (userList, assigned = false) => {
    return userList.map((user) => (
      <ListGroup.Item
        key={user.id}
        className="d-flex justify-content-between align-items-center"
      >
        {`${user.lastName} ${user.firstName[0]}.`}
        <Button
          variant={assigned ? "danger" : "primary"}
          onClick={() => handleAssignUser(user.id)}
        >
          {assigned ? "Отменить" : "Назначить"}
        </Button>
      </ListGroup.Item>
    ));
  };

  const departmentSortedList = departmentsData.sort((a, b) =>
    a.Name.localeCompare(b.Name)
  );
  const usersByDepartment = departmentSortedList.map((department) => {
    const departmentUsers = users.filter(
      (user) => user.department === department.Code
    );
    const assignedUsers = departmentUsers.filter((user) =>
      assignedUserIds.includes(user.id)
    );
    const availableUsers = departmentUsers.filter(
      (user) => !assignedUserIds.includes(user.id)
    );
    return (
      <Accordion.Item eventKey={department.Code} key={department.Code}>
        <Accordion.Header className="none-collapsed">
          {`${department.Name} (${assignedUsers.length})`}
        </Accordion.Header>
        <Accordion.Body>
          <div style={{ display: "flex", flexDirection: "row", gap: "12px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: "50% 0 0",
              }}
            >
              <p style={{ fontWeight: "500" }}>Назначенные исполнители:</p>
              <ListGroup>{renderUserList(assignedUsers, true)}</ListGroup>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: "50% 0 0",
              }}
            >
              <p style={{ fontWeight: "500" }}>Доступные для назначения:</p>
              <ListGroup>{renderUserList(availableUsers, false)}</ListGroup>
            </div>
          </div>
        </Accordion.Body>
      </Accordion.Item>
    );
  });

  return (
    <div>
      <Accordion defaultActiveKey="0">{usersByDepartment}</Accordion>
    </div>
  );
};

export default AssignUserBuilding;
