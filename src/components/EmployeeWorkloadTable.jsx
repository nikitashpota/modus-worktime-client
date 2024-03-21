import { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import DateFilter from "./DateFilter";
import axios from "../services/axios";
import "./EmployeeWorkloadTable.css";
import * as XLSX from "xlsx";

function EmployeeWorkloadTable() {
  const [users, setUsers] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [logs, setLogs] = useState([]);
  const [hoursByProject, setHoursByProject] = useState([]);

  const handleFilter = (date) => {
    const filterLogs = filterLogsByDate(logs, date.startDate, date.endDate);
    const calculateHours = calculateHoursByProject(filterLogs);
    setHoursByProject(calculateHours);
  };

  const compileData = (percentages, buildings, users) => {
    // Преобразуем percentages в удобный формат
    const percentagesTransformed = {};
    Object.keys(percentages).forEach((key) => {
      const [userId, buildingId] = key.split("_").map(Number);
      percentagesTransformed[`${userId}_${buildingId}`] = percentages[key];
    });

    // Преобразуем buildings в словарь
    const buildingsDict = buildings.reduce((acc, current) => {
      acc[current.id] = current.name;
      return acc;
    }, {});

    // Собираем итоговый массив
    const result = users.map((user) => {
      const exportObject = {
        department: user.department,
        lastName: user.lastName,
        firstName: user.firstName,
      };

      Object.entries(buildingsDict).forEach(([buildingId, buildingName]) => {
        const percentageKey = `${user.id}_${buildingId}`;
        exportObject[buildingName] =
          percentagesTransformed[percentageKey] || "0"; // Если нет данных, ставим 0
      });

      return exportObject;
    });

    return result;
  };

  // const compiledData = compileData(percentages, buildings, users);
  // console.log(compiledData);

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

  const calculateHoursByProject = (logs) => {
    let totalHoursByUser = {}; // Общее количество часов по каждому сотруднику
    let hoursByProjectByUser = {}; // Часы по каждому проекту для каждого сотрудника

    logs.forEach((log) => {
      const projectKey = `${log.userId}_${log.buildingId}`;
      const userKey = log.userId;
      if (!hoursByProjectByUser[projectKey]) {
        hoursByProjectByUser[projectKey] = 0;
      }
      hoursByProjectByUser[projectKey] += parseFloat(log.hours);

      if (!totalHoursByUser[userKey]) {
        totalHoursByUser[userKey] = 0;
      }
      totalHoursByUser[userKey] += parseFloat(log.hours);
    });

    // Вычисляем процентное соотношение
    let percentageByProjectByUser = {};
    Object.keys(hoursByProjectByUser).forEach((projectKey) => {
      const [userId, _] = projectKey.split("_");
      const totalHours = totalHoursByUser[userId];
      const projectHours = hoursByProjectByUser[projectKey];
      const percentage = (projectHours / totalHours) * 100;
      percentageByProjectByUser[projectKey] = percentage.toFixed(1); //
    });

    return percentageByProjectByUser;
  };

  useEffect(() => {
    // Функция для получения данных о пользователях
    const fetchUsers = async () => {
      const response = await axios.get("/users");
      const data = response.data;
      const sortData = data.sort((a, b) => {
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
      setUsers(sortData);
    };
    // Функция для получения данных о зданиях
    const fetchBuildings = async () => {
      const response = await axios.get("/buildings");
      const data = response.data;
      const sortData = data.sort((a, b) => {
        return a.createdAt.localeCompare(b.createdAt);
      });
      setBuildings(sortData);
    };
    // Функция для получения логов работы
    const fetchLogs = async () => {
      const response = await axios.get("/workTimeLogs");
      const data = response.data;
      setLogs(data);
    };
    fetchUsers();
    fetchBuildings();
    fetchLogs();
  }, []);

  const exportToXlsx = (data, fileName) => {
    console.log(hoursByProject);
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "UserData");

    // Создание XLSX файла
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  // Представление таблицы
  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <DateFilter onFilter={handleFilter} />
      </div>

      <Table bordered className="table thin-header">
        <thead>
          <tr>
            <th>Отдел / Сотрудник</th>
            {buildings.map((building) => (
              <th key={building.id}>{building.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{`${user.firstName} ${user.lastName} (${user.department})`}</td>
              {buildings.map((building) => {
                const hoursKey = `${user.id}_${building.id}`;
                const hours = hoursByProject[hoursKey] || 0;
                return <td key={building.id}>{hours}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </Table>
      <Button
        variant="success"
        onClick={() =>
          exportToXlsx(
            compileData(hoursByProject, buildings, users),
            "CompileData"
          )
        }
        className="mt-3"
      >
        Скачать
      </Button>
    </div>
  );
}

export default EmployeeWorkloadTable;
