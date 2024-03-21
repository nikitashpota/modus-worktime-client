import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import axios from "../services/axios"; // Ваша настроенная инстанция axios
import { useAuth } from "../services/AuthContext"; // Контекст аутентификации
import TimeTableCell from "./TimeTableCell"; // Компонент ячейки таблицы
import { format, addDays, subDays } from "date-fns";

import "./TimeTable.css";

const TimeTable = () => {
  const { userId } = useAuth();
  const [buildings, setBuildings] = useState([]);
  const [dates, setDates] = useState([]);
  const [workTimeLogs, setWorkTimeLogs] = useState([]);
  const [update, setUpdate] = useState(false);

  function formatDateWithWeekday(date) {
    // Получаем день недели сокращенно
    const weekDayShort = date
      .toLocaleString("ru-RU", { weekday: "short" })
      .replace(".", "");
    // Получаем дату в формате день.месяц
    const dateStr = date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
    });
    // Собираем и возвращаем итоговую строку
    return `${weekDayShort}, ${dateStr}`;
  }

  const updateWorkTimeLogs = () => {
    setUpdate(!update);
  };

  const today = new Date();
  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        try {
          // Запросы к серверу для получения данных...

          const buildingsResponse = await axios.get(`/userBuildings/${userId}`);
          setBuildings(
            buildingsResponse.data.sort(
              (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            )
          );
          const logs = await axios.get(`/workTimeLogs/${userId}`);
          setWorkTimeLogs(logs.data);

          // Генерация дат для отображения в шапке таблицы...

          const datesArray = [];

          // Генерация дат с неделю назад до двух дней вперед
          for (let i = -7; i <= 2; i++) {
            const date =
              i < 0 ? subDays(today, Math.abs(i)) : addDays(today, i);
            datesArray.push(date);
          }

          setDates(datesArray);
        } catch (error) {
          console.error("Ошибка при загрузке данных:", error);
        }
      };

      fetchData();
    }
  }, [userId, update]);

  return (
    <Table bordered className="table thin-header">
      <thead>
        <tr>
          <th style={{ minWidth: "200px", maxWidth: "400px" }}></th>
          {dates.map((date, index) => (
            <th
              key={index}
              style={{
                backgroundColor:
                  formatDateWithWeekday(date) === formatDateWithWeekday(today)
                    ? "#c7ccc985"
                    : "transparent",
              }}
            >
              {formatDateWithWeekday(date)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {buildings.map((building) => (
          <tr key={building.id}>
            <td style={{ minWidth: "250px", maxWidth: "400px" }}>
              {building.name}
            </td>
            {dates.map((date) => {
              const dateString = date.toISOString().split("T")[0];

              const logs = workTimeLogs.filter(
                (log) =>
                  log.date === dateString && log.buildingId === building.id
              );
              return (
                <td key={date.toISOString()}>
                  <TimeTableCell
                    date={dateString}
                    logs={logs}
                    buildingId={building.id}
                    onUpdate={updateWorkTimeLogs}
                  />
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TimeTable;
