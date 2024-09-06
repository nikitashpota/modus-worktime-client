import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Dropdown, ListGroup } from "react-bootstrap";
import TaskListItem from "../components/TaskListItem";
import TaskEditModal from "../components/TaskEditModal";
import TaskCreateModal from "../components/TaskCreateModal";
import { MultiSelect } from "react-multi-select-component";
import axios from "../services/axios";
import { useAuth } from "../services/AuthContext";

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { userId } = useAuth();

  // Фильтры
  const [filterOptions, setFilterOptions] = useState({
    issuers: [],
    receivers: [],
  });

  // Фильтр задач
  const [taskFilter, setTaskFilter] = useState("tasksToAndFromMe"); // По умолчанию задачи мне и от меня

  // Загрузка задач и данных для фильтрации с сервера
  useEffect(() => {
    if (userId) {
      fetchTasks();
      fetchFilterOptions();
    }
  }, [userId]);

  useEffect(() => {
    if (tasks.length > 0) {
      filterTasks(); // Обновляем фильтр при изменении фильтра
    }
  }, [tasks, taskFilter]);

  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get("/users");
      const users = response.data.map((user) => ({
        label: `${user.firstName} ${user.lastName}`,
        value: user.id,
      }));
      setFilterOptions({
        issuers: users,
        receivers: users,
      });
    } catch (error) {
      console.error("Ошибка при загрузке данных для фильтров", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`/tasks/all`); // Загружаем все задачи
      setTasks(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке задач", error);
    }
  };

  const filterTasks = () => {
    let filtered = [...tasks];
    switch (taskFilter) {
      case "tasksToMe":
        filtered = filtered.filter((task) => Number(task.receiverId) === Number(userId)); // Задачи мне
        break;
      case "tasksFromMe":
        filtered = filtered.filter((task) => Number(task.issuerId) === Number(userId)); // Задачи от меня
        break;
      case "allTasks":
        // Не фильтруем, показываем все задачи
        break;
      case "tasksToAndFromMe":
      default:
        filtered = filtered.filter(
          (task) => Number(task.receiverId) === Number(userId) || Number(task.issuerId) === Number(userId)
        ); // Задачи мне и от меня
        break;
    }
    setFilteredTasks(filtered);
  };

  const handleFilterChange = (option) => {
    setTaskFilter(option);
  };

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedTask(null);
  };

  const handleTaskCreated = (newTask) => {
    setTasks([...tasks, newTask]);
    setShowCreateModal(false); // Закрываем модальное окно после создания задачи
    fetchTasks(); // Обновляем задачи
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    handleCloseModal();
  };

  return (
    <Container fluid>
      {/* Верхняя полоса управления задачами */}
      <Row className="mb-3" style={{ backgroundColor: "#f8f9fa", height: "50px", alignItems: "center" }}>
        <Col>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            Создать задачу
          </Button>
        </Col>
        <Col style={{display: "flex", justifyContent: "end"}}>
          <Dropdown>
            <Dropdown.Toggle variant="secondary">
              Фильтр: {taskFilter === "tasksToMe" 
                ? "Задачи мне" 
                : taskFilter === "tasksFromMe" 
                ? "Задачи от меня" 
                : taskFilter === "tasksToAndFromMe"
                ? "Задачи мне и от меня"
                : "Все задачи"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleFilterChange("tasksToMe")}>Задачи мне</Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilterChange("tasksFromMe")}>Задачи от меня</Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilterChange("tasksToAndFromMe")}>Задачи мне и от меня</Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilterChange("allTasks")}>Все задачи</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      {/* Список задач */}
      <Row>
        <Col>
          <ListGroup>
            {filteredTasks.map((task) => (
              <TaskListItem key={task.id} task={task} onEditClick={handleEditClick} />
            ))}
          </ListGroup>
        </Col>
      </Row>

      {/* Модальное окно для создания задачи */}
      <TaskCreateModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTaskCreated={handleTaskCreated}
      />

      {/* Модальное окно для редактирования задачи */}
      {selectedTask && (
        <TaskEditModal
          show={showEditModal}
          task={selectedTask}
          onClose={handleCloseModal}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
    </Container>
  );
};

export default TaskManagement;
