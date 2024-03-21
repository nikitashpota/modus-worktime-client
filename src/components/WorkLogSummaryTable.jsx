import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "../services/axios"; // Адаптируйте путь к вашей конфигурации axios
import DateFilter from "./DateFilter";
import "./TimeTable.css";
import * as XLSX from "xlsx";

const WorkLogSummaryTable = () => {
  const [userData, setUserData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // const [filteredLogs, setFilteredLogs] = useState([]);

  const handleFilter = (date) => {
    setStartDate(date.startDate);
    setEndDate(date.endDate);
  };

  const filterLogsByDate = (logs, startDate, endDate) => {
    // Преобразование строк даты в объекты Date для сравнения
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Фильтрация логов по диапазону дат
    const filteredLogs = logs.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= start && logDate <= end;
    });
    return filteredLogs;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Предполагается, что /users и /workTimeLogs это эндпоинты API для получения информации о пользователях и логах работы соответственно
        const usersResponse = await axios.get("/users");
        const sortUsers = usersResponse.data.sort((a, b) => {
          if (a.department != b.department) {
            return a.department.localeCompare(b.department);
          }
          if (a.lastName != b.lastName) {
            return a.lastName.localeCompare(b.lastName);
          }
          if (a.firstName != b.firstName) {
            return a.firstName.localeCompare(b.firstName);
          }
        });

        const logsResponse = await axios.get("/workTimeLogs");

        // Обработка данных и создание структуры данных для таблицы
        // Это место для вашей логики преобразования и агрегации данных
        const updatedFilteredLogs = filterLogsByDate(
          logsResponse.data,
          startDate,
          endDate
        );
        const processedData = processUserData(sortUsers, updatedFilteredLogs);
        setUserData(processedData);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  // Функция для обработки и агрегации данных пользователей и логов
  const processUserData = (users, logs) => {
    // Создание карты для удобного доступа к данным пользователей по их ID
    const usersMap = users.reduce((acc, user) => {
      acc[user.id] = {
        ...user,
        totalDays: new Set(),
        totalHours: 0,
        tasksCount: new Set(),
        buildingsCount: new Set(),
      };
      return acc;
    }, {});

    // Обход всех логов для агрегации данных
    logs.forEach((log) => {
      const user = usersMap[log.userId];
      if (user) {
        user.totalDays.add(log.date); // Учитываем уникальные дни работы
        user.totalHours += parseFloat(log.hours); // Суммируем часы
        user.tasksCount.add(log.workType); // Учитываем уникальные виды работ
        user.buildingsCount.add(log.buildingId); // Учитываем уникальные здания
      }
    });

    // Преобразование данных обратно в массив и подготовка к выводу
    const processedData = Object.values(usersMap).map((user) => ({
      ...user,
      totalDays: user.totalDays.size, // Преобразование Set в количество уникальных дней
      tasksCount: user.tasksCount.size, // Преобразование Set в количество уникальных задач
      buildingsCount: user.buildingsCount.size, // Преобразование Set в количество зданий
    }));

    return processedData;
  };

  const exportToXlsx = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "UserData");

    // Создание XLSX файла
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <>
      <div style={{ marginBottom: "16px" }}>
        <DateFilter onFilter={handleFilter} />
      </div>
      <Table bordered className="table thin-header">
        <thead>
          <tr>
            <th>Фамилия И.</th>
            <th>Общее кол-во дней</th>
            <th>Количество часов</th>
            <th>Количество задач</th>
            <th>Количество объектов</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((user) => (
            <tr key={user.id}>
              <td>{`${user.lastName} ${user.firstName}`}</td>
              <td>{user.totalDays}</td>
              <td>{user.totalHours}</td>
              <td>{user.tasksCount}</td>
              <td>{user.buildingsCount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button
        variant="success"
        onClick={() => exportToXlsx(userData, "UserData")}
        className="mt-3"
      >
        Скачать
      </Button>
    </>
  );
};

export default WorkLogSummaryTable;
