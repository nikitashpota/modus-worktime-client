import React, { useState, useEffect } from "react";
import axios from "../services/axios";
import { MultiSelect } from "react-multi-select-component";
import { Chart } from "react-google-charts";
import { Card } from "react-bootstrap"; // Импортируем карточку из Bootstrap для стилизации

const OverlappingSectionsChart = ({ users }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sections, setSections] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (selectedUsers.length > 0) {
      fetchSectionsForSelectedUsers();
    }
  }, [selectedUsers]);

  const fetchSectionsForSelectedUsers = async () => {
    try {
      const responses = await Promise.all(
        selectedUsers.map((user) =>
          axios.get(`/sections/by-user/${user.value}`)
        )
      );
      const fetchedSections = responses.flatMap((response) => response.data);
      setSections(fetchedSections);
      generateChartData(fetchedSections);
    } catch (error) {
      console.error("Ошибка при загрузке разделов:", error);
    }
  };

  const generateChartData = (sections) => {
    if (!sections || sections.length === 0) {
      console.error("Нет данных для разделов");
      return;
    }

    const sortedSections = sections.sort((a, b) => {
      if (a.section.building.number !== b.section.building.number) {
        return a.section.building.number.localeCompare(
          b.section.building.number
        );
      }
      if (a.section.stage !== b.section.stage) {
        return a.section.stage.localeCompare(b.section.stage);
      }
      return a.section.sectionCode.localeCompare(b.section.sectionCode);
    });

    const columns = [
      { type: "string", label: "Раздел" },
      { type: "date", label: "Начало" },
      { type: "date", label: "Конец" },
    ];

    const rows = sortedSections
      .map((section) => {
        const { startDate, endDate, sectionCode, stage } = section.section;
        const start = new Date(startDate);
        const end = new Date(endDate);

        return [
          `${section.section.building.name}: ${sectionCode} (${stage})`,
          start,
          end,
        ];
      })
      .filter((row) => row !== null);

    setChartData([columns, ...rows]);
  };

  const options = {
    timeline: {
      colorByRowLabel: true,
      rowLabelStyle: { fontName: "Segoe UI", fontSize: 14, color: "#333" },
      barLabelStyle: { fontName: "Segoe UI", fontSize: 14, color: "#333" },
    },
    backgroundColor: "#ffffff",
    colors: ["#1c91c0", "#4374e0", "#e49307", "#e07103", "#e49307", "#1c91c0"],
    hAxis: {
      textStyle: {
        color: "#333",
        fontSize: 14,
        fontName: "Segoe UI",
        bold: false,
        italic: false,
      },
    },
    vAxis: {
      textStyle: {
        color: "#333",
        fontSize: 14,
        fontName: "Segoe UI",
        bold: false,
        italic: false,
      },
    },
  };

  return (
    <div style={{ padding: "20px", margin: "20px" }}>
      <MultiSelect
        options={users.map((user) => ({
          label: `${user.lastName} ${user.firstName} (${user.department})`,
          value: user.id,
        }))}
        value={selectedUsers}
        onChange={setSelectedUsers}
        labelledBy="Выберите пользователей"
      />
      <div style={{ height: "calc(100vh - 300px)", marginTop: "20px" }}>
        {chartData.length > 1 && (
          <Chart
            chartType="Timeline"
            data={chartData}
            width="100%"
            height="100%"
            options={options}
          />
        )}
      </div>
    </div>
  );
};

export default OverlappingSectionsChart;
