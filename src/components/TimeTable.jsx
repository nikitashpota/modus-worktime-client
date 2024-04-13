import React, { useState, useEffect } from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import axios from "../services/axios";
import { useAuth } from "../services/AuthContext";
import TimeTableCell from "./TimeTableCell";
import { format, parseISO, subDays, addDays } from "date-fns";

import "./TimeTable.css";

const TimeTable = () => {
  const { userId } = useAuth();
  const [buildings, setBuildings] = useState([]);
  const [dates, setDates] = useState([]);
  const [workTimeLogs, setWorkTimeLogs] = useState([]);
  const today = new Date();
  const sevenDaysAgo = subDays(today, 7);
  const twoDaysAhead = addDays(today, 2);

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

  const [startDate, setStartDate] = useState(
    localStorage.getItem("selectedStartDate") ||
      format(sevenDaysAgo, "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(
    localStorage.getItem("selectedEndDate") ||
      format(twoDaysAhead, "yyyy-MM-dd")
  );

  const updateDateRange = () => {
    // Генерация дат для отображения в шапке таблицы
    let start = startDate ? parseISO(startDate) : new Date();
    let end = endDate ? parseISO(endDate) : new Date();

    let tempDates = [];
    let currentDate = new Date(start);

    while (currentDate <= end) {
      tempDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setDates(tempDates);

    localStorage.setItem("selectedStartDate", startDate);
    localStorage.setItem("selectedEndDate", endDate);
  };

  const updateWorkTimeLogs = () => {
    fecthLogs();
  };

  const fecthLogs = async () => {
    try {
      const logsResponse = await axios.get(`/workTimeLogs/${userId}`);
      setWorkTimeLogs(logsResponse.data);
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    if (userId) {
      try {
        const buildingsResponse = await axios.get(`/userBuildings/${userId}`);
        setBuildings(buildingsResponse.data);
        const logsResponse = await axios.get(`/workTimeLogs/${userId}`);
        setWorkTimeLogs(logsResponse.data);

        // Генерация дат для отображения в шапке таблицы
        let start = startDate ? parseISO(startDate) : new Date();
        let end = endDate ? parseISO(endDate) : new Date();

        let tempDates = [];
        let currentDate = new Date(start);

        while (currentDate <= end) {
          tempDates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }

        setDates(tempDates);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    }
  };

  return (
    <>
      <Row className="mb-3" style={{ width: "500px" }}>
        <Col>
          <Form.Control
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Col>
        <Col>
          <Form.Control
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Col>
        <Col>
          <Button onClick={updateDateRange} variant="outline-primary">
            Применить
          </Button>
        </Col>
      </Row>
      <div style={{ overflowX: "auto" }} className="table-responsive">
        <Table bordered className="table thin-header">
          <thead>
            <tr>
              <th
                style={{
                  minWidth: "200px",
                  position: "sticky",
                  left: 0,
                  background: "white",
                  zIndex: 1,
                }}
              >
                Объект
              </th>
              {dates.map((date, index) => (
                <th
                  key={index}
                  style={{
                    backgroundColor:
                      formatDateWithWeekday(date) ===
                      formatDateWithWeekday(today)
                        ? "#c7ccc985"
                        : "transparent",
                    textAlign: "center",
                    minWidth: "110px",
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
                <td
                  style={{
                    position: "sticky",
                    left: 0,
                    background: "white",
                    zIndex: 1,
                  }}
                >
                  {building.name}
                </td>
                {dates.map((date) => {
                  const dateString = format(date, "yyyy-MM-dd");
                  const logs = workTimeLogs.filter(
                    (log) =>
                      log.date === dateString && log.buildingId === building.id
                  );
                  return (
                    <td
                      key={dateString}
                      style={{ textAlign: "center", minWidth: "110px" }}
                    >
                      <TimeTableCell
                        key={`${dateString}_${building.id}`}
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
      </div>
    </>
  );
};

export default TimeTable;
