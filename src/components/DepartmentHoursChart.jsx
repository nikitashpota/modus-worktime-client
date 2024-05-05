import React, { useState, useEffect, useRef } from "react";
import axios from "../services/axios";
import { Form, Row, Col, Button } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const DepartmentHoursChart = ({ users, buildings, workTimeLogs }) => {
  // const [users, setUsers] = useState([]);
  // const [buildings, setBuildings] = useState([]);
  // const [workTimeLogs, setWorkTimeLogs] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const chartContainerRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(null);

  useEffect(() => {
    // Функция для обновления ширины графика
    const updateChartWidth = () => {
      if (chartContainerRef.current) {
        setChartWidth(chartContainerRef.current.offsetWidth);
      }
    };
    updateChartWidth();
    window.addEventListener("resize", updateChartWidth);
    return () => {
      window.removeEventListener("resize", updateChartWidth);
    };
  }, [selectedBuilding, startDate, endDate]);

  // Фильтрация данных
  useEffect(() => {
    // Фильтрация по зданию и датам
    const filteredLogs = workTimeLogs.filter((log) => {
      const logDate = new Date(log.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return (
        log.buildingId == selectedBuilding && logDate >= start && logDate <= end
      );
    });


    // Суммирование часов по отделам
    const hoursByDepartment = filteredLogs.reduce((acc, log) => {
      const user = users.find((u) => u.id === log.userId);
      if (user && user.department) {
        acc[user.department] =
          (acc[user.department] || 0) + parseFloat(log.hours);
      }
      return acc;
    }, {});

    const dataForChart = Object.keys(hoursByDepartment).map((department) => ({
      department,
      hours: hoursByDepartment[department],
    }));

    setFilteredData(dataForChart);
  }, [selectedBuilding, startDate, endDate, workTimeLogs, users]);

  return (
    <>
      <Row style={{ marginBottom: "32px" }}>
        <Col>
          <Form.Select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
          >
            <option>Выберите здание</option>
            {buildings.map((building) => (
              <option key={building.id} value={building.id}>
                {building.name}
              </option>
            ))}
          </Form.Select>
        </Col>
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
      </Row>
      <div
        ref={chartContainerRef}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <div>График объект - отделы - часы</div>
        <BarChart
          width={chartWidth ? chartWidth : 900}
          height={500}
          data={filteredData}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="department" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="hours" fill="#8884d8" />
        </BarChart>
      </div>
    </>
  );
};

export default DepartmentHoursChart;
