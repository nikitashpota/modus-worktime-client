import React, { useState, useEffect } from "react";
import { Modal, Button, ListGroup, Accordion } from "react-bootstrap";
import axios from "../services/axios";
import departmentsData from "../services/departmentsData";
import "./AssignUserToSectionModal.css";

const AssignUserToSectionModal = ({ show, onHide, sectionId }) => {
  const [users, setUsers] = useState([]);
  const [assignedUserIds, setAssignedUserIds] = useState([]);

  useEffect(() => {
    const fetchUsersAndAssignments = async () => {
      try {
        const usersResponse = await axios.get(`/users`);
        const assignedResponse = await axios.get(
          `/sections/${sectionId}/assigned-users`
        );
        setUsers(usersResponse.data);
        setAssignedUserIds(assignedResponse.data.map((user) => user.id));
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    if (show) {
      fetchUsersAndAssignments();
    }
  }, [sectionId, show]);

  // Функция для добавления пользователя к разделу
  const handleAssignUser = async (userId, sectionId) => {
    try {
      await axios.post("/sections/assign-user", {
        userId,
        sectionId,
      });
      setAssignedUserIds([...assignedUserIds, userId]);
    } catch (error) {
      console.error("Ошибка при назначении пользователя разделу:", error);
    }
  };

  // Функция для удаления пользователя из раздела
  const handleUnassignUser = async (userId, sectionId) => {
    console.log("sectionId", sectionId);
    try {
      await axios.post("/sections/unassign-user", {
        userId,
        sectionId,
      });
      setAssignedUserIds(assignedUserIds.filter((id) => id !== userId));
    } catch (error) {
      console.error("Ошибка при удалении пользователя из раздела:", error);
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
          variant={assigned ? "outline-danger" : "outline-primary"}
          onClick={
            assigned
              ? () => handleUnassignUser(user.id, sectionId)
              : () => handleAssignUser(user.id, sectionId)
          }
        >
          {assigned ? "Отменить" : "Назначить"}
        </Button>
      </ListGroup.Item>
    ));
  };

  const usersByDepartment = departmentsData.map((department) => {
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
        <Accordion.Header className="none-collapsed">{`${department.Name} (${assignedUsers.length})`}</Accordion.Header>
        <Accordion.Body>
          <div style={{ display: "flex", flexDirection: "row", gap: "12px" }}>
            <div style={{ flex: "50%" }}>
              <p style={{ fontWeight: "500" }}>Назначенные исполнители:</p>
              <ListGroup>{renderUserList(assignedUsers, true)}</ListGroup>
            </div>
            <div style={{ flex: "50%" }}>
              <p style={{ fontWeight: "500" }}>Доступные для назначения:</p>
              <ListGroup>{renderUserList(availableUsers, false)}</ListGroup>
            </div>
          </div>
        </Accordion.Body>
      </Accordion.Item>
    );
  });

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "18px" }}>
          Назначение пользователей на раздел
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Accordion defaultActiveKey="0">{usersByDepartment}</Accordion>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Закрыть
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AssignUserToSectionModal;
