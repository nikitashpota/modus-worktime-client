import React, { useState, useEffect } from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import axios from "../services/axios";
import { useAuth } from "../services/AuthContext";
import TimeTableCell from "./TimeTableCell";
import { format, parseISO, subDays, addDays } from "date-fns";
import "./TimeTable.css";

const TimeTable = () => {
  const { userId } = useAuth();
  const [sections, setSections] = useState([]); // Новый массив для разделов
  const [dates, setDates] = useState([]);
  const [workTimeLogs, setWorkTimeLogs] = useState([]);
  const today = new Date();
  const sevenDaysAgo = subDays(today, 7);
  const twoDaysAhead = addDays(today, 2);

  const formatDateWithWeekday = (date) => {
    const weekDayShort = date
      .toLocaleString("ru-RU", { weekday: "short" })
      .replace(".", "");
    const dateStr = date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
    });
    return `${weekDayShort}, ${dateStr}`;
  };

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

  const [startDate, setStartDate] = useState(
    localStorage.getItem("selectedStartDate") ||
      format(sevenDaysAgo, "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(
    localStorage.getItem("selectedEndDate") ||
      format(twoDaysAhead, "yyyy-MM-dd")
  );

  useEffect(() => {
    fetchSectionsAndLogs();
    updateDateRange();
  }, [userId, startDate, endDate]);

  const fetchSectionsAndLogs = async () => {
    if (userId) {
      try {
        const sectionsResponse = await axios.get(`/sections/by-user/${userId}`);
        setSections(sectionsResponse.data);
        const logsResponse = await axios.get(`/workTimeLogs/${userId}`);
        setWorkTimeLogs(logsResponse.data);
        console.log("userId", sectionsResponse.data);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    }
  };

  return (
    <>
      <Row className="mb-3" style={{ width: "400px" }}>
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
        {/* <Col>
          <Button onClick={updateDateRange} variant="outline-primary">
            Применить
          </Button>
        </Col> */}
      </Row>
      <div style={{ overflowX: "auto" }} className="table-responsive">
        <Table bordered className="table thin-header">
          <thead>
            <tr>
              <th className="first-column__width"></th>
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
            {sections.map((us) => (
              <tr key={us.section.id}>
                <td className="first-column__width">
                  <p style={{ fontWeight: 500 }}>{us.section.building.name}</p>
                  <pre>{`Раздел: ${us.section.sectionCode} Стадия: ${us.section.stage}`}</pre>
                </td>
                {dates.map((date) => {
                  const dateString = format(date, "yyyy-MM-dd");
                  const logs = workTimeLogs.filter(
                    (log) =>
                      log.date === dateString && log.sectionId === us.section.id
                  );
                  return (
                    <td
                      key={dateString}
                      style={{
                        textAlign: "center",
                        minWidth: "110px",
                        position: "relative",
                      }}
                    >
                      <TimeTableCell
                        key={`${dateString}_${us.section.id}`}
                        date={dateString}
                        logs={logs}
                        sectionId={us.section.id}
                        buildingId={us.section.buildingId}
                        onUpdate={fetchSectionsAndLogs}
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
