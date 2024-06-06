import React, { useState, useEffect } from "react";
import { Table, Form, Button, Row, Col, Badge } from "react-bootstrap";
import { MultiSelect } from "react-multi-select-component";
import axios from "../services/axios";
import { useAuth } from "../services/AuthContext";
import TimeTableCell from "./TimeTableCell";
import { format, parseISO, subDays, addDays } from "date-fns";
import "./TimeTable.css";

const TimeTable = () => {
  const { userId } = useAuth();
  const [sections, setSections] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [dates, setDates] = useState([]);
  const [workTimeLogs, setWorkTimeLogs] = useState([]);
  const [buildingOptions, setBuildingOptions] = useState([]);
  const [sectionCodeOptions, setSectionCodeOptions] = useState([]);
  const [selectedBuildings, setSelectedBuildings] = useState([]);
  const [selectedSectionCodes, setSelectedSectionCodes] = useState([]);
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

  useEffect(() => {
    filterSections();
  }, [selectedBuildings, selectedSectionCodes, sections]);

  const fetchSectionsAndLogs = async () => {
    if (userId) {
      try {
        const sectionsResponse = await axios.get(`/sections/by-user/${userId}`);
        const sectionsData = sectionsResponse.data;
        setSections(sectionsData);

        const buildingNames = [
          ...new Set(sectionsData.map((us) => us.section.building.name)),
        ];
        const sectionCodes = [
          ...new Set(sectionsData.map((us) => us.section.sectionCode)),
        ];

        setBuildingOptions(
          buildingNames.map((name) => ({ label: name, value: name }))
        );
        setSectionCodeOptions(
          sectionCodes.map((code) => ({ label: code, value: code }))
        );

        const logsResponse = await axios.get(`/workTimeLogs/${userId}`);
        setWorkTimeLogs(logsResponse.data);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    }
  };

  const filterSections = () => {
    let filtered = sections;
    if (selectedBuildings.length > 0) {
      const buildingNames = selectedBuildings.map((b) => b.value);
      filtered = filtered.filter((us) =>
        buildingNames.includes(us.section.building.name)
      );
    }
    if (selectedSectionCodes.length > 0) {
      const sectionCodes = selectedSectionCodes.map((sc) => sc.value);
      filtered = filtered.filter((us) =>
        sectionCodes.includes(us.section.sectionCode)
      );
    }
    setFilteredSections(filtered);
  };

  return (
    <>
      <Row className="mb-3" style={{ width: "100%" }}>
        <Col>
          <Form.Group>
            <Form.Label>Начало периода</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Окончание периода</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Фильтр объектов</Form.Label>
            <MultiSelect
              options={buildingOptions}
              value={selectedBuildings}
              onChange={setSelectedBuildings}
              labelledBy="Выберите здание"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Фильтр разделов</Form.Label>
            <MultiSelect
              options={sectionCodeOptions}
              value={selectedSectionCodes}
              onChange={setSelectedSectionCodes}
              labelledBy="Выберите раздел"
            />
          </Form.Group>
        </Col>
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
                        ? "#262627"
                        : "transparent",
                    textAlign: "center",
                    minWidth: "110px",
                    color:
                      formatDateWithWeekday(date) ===
                      formatDateWithWeekday(today)
                        ? "white"
                        : "black",
                  }}
                >
                  {formatDateWithWeekday(date)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredSections.map((us) => (
              <tr key={us.section.id}>
                <td className="first-column__width">
                  <h5
                    style={{ fontWeight: 400, fontSize: 16 }}
                  >{`${us.section.building.number}`}</h5>
                  <h5
                    style={{ fontWeight: 500, fontSize: 16 }}
                  >{`${us.section.building.name}`}</h5>
                  <h5 style={{ fontWeight: 400, fontSize: 16 }}>
                    Раздел:{" "}
                    <span style={{ fontWeight: 500 }}>
                      {us.section.sectionCode}
                    </span>
                  </h5>
                  <h5 style={{ fontWeight: 400, fontSize: 16 }}>
                    Стадия:{" "}
                    <span style={{ fontWeight: 500 }}>{us.section.stage}</span>
                  </h5>
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
