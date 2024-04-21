import React, { useState, useEffect } from "react";
import { Table, Form, Button, Col, Row } from "react-bootstrap";
import axios from "../services/axios";
import { MultiSelect } from "react-multi-select-component"; // Допустим, используется для мультиселекта
import DateFilter from "./DateFilter";
import "./TimeTable.css";

const ProjectOverview = ({ users, buildings, workTimeLogs }) => {
  const [sortUsers, setSortUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

  useEffect(() => {
    const sortUsers = users
      .sort((a, b) => {
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
      .map((user) => ({
        label: `${user.lastName} ${user.firstName} (${user.department})`,
        value: user.id,
      }));
    setSortUsers(sortUsers);

    const today = new Date();
    const firstDayCurrentMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    )
      .toISOString()
      .split("T")[0];
    const lastDayCurrentMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    )
      .toISOString()
      .split("T")[0];

    setDateRange({
      startDate: firstDayCurrentMonth,
      endDate: lastDayCurrentMonth,
    });
  }, [users, buildings, workTimeLogs]);

  const handleFilter = (date) => {
    setDateRange(date);
  };

  // Функция фильтрации данных в таблице
  const filteredLogs = workTimeLogs
    .filter(
      (log) =>
        selectedUsers.find((user) => user.value === log.userId) &&
        log.date >= dateRange.startDate &&
        log.date <= dateRange.endDate
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  function convertDateFormat(dateStr) {
    const [year, month, day] = dateStr.split("-");
    return `${day}.${month}.${year.substring(2)}`;
  }

  return (
    <div>
      {/* Фильтры */}
      <Row className="mb-3">
        <Col className="mb-3">
          <MultiSelect
            options={sortUsers}
            value={selectedUsers}
            onChange={setSelectedUsers}
            labelledBy={"Выберите"}
          />
        </Col>
        <Col>
          <DateFilter onFilter={handleFilter} />
        </Col>
      </Row>

      {/* Таблица */}
      <Table bordered className="table thin-header">
        <thead>
          <tr>
            <th style={{ minWidth: "100px", maxWidth: "200px" }}>
              ФИО (Отдел)
            </th>
            <th style={{ minWidth: "100px", maxWidth: "200px" }}>Объект</th>
            <th>Дата</th>
            <th>Часы</th>
            <th style={{ minWidth: "250px" }}>Описание задачи</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((log) => (
            <tr key={log.id}>
              <td style={{ minWidth: "100px", maxWidth: "200px" }}>
                {selectedUsers.find((us) => us.value == log.userId)?.label}
              </td>
              <td style={{ minWidth: "100px", maxWidth: "200px" }}>
                {buildings.find((b) => b.id === log.buildingId)?.name}
              </td>
              <td>{convertDateFormat(log.date)}</td>
              <td>{log.hours}</td>
              <td style={{ minWidth: "250px" }}>{log.workType}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProjectOverview;
