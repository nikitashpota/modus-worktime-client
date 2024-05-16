import { useState, useEffect } from "react";
import axios from "../services/axios";
import { Badge } from "react-bootstrap";
import CustomPieChart from "./CustomPieChart";
import LegendComponent from "./LegendComponent";
import { motion } from "framer-motion";

const variants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } },
};

const FinancialCharts = ({ building }) => {
  const [data, setData] = useState(null);
  const [initialCosts, setInitialCosts] = useState([]);
  const [dateCosts, setDateCosts] = useState([]);
  const [updatedCosts, setUpdatedCosts] = useState([]);
  const [workTimeLogs, setWorkTimeLogs] = useState([]);
  const COLORS = [
    "#3366CC",
    "#DC3912",
    "#FF9900",
    "#109618",
    "#990099",
    "#3B3EAC",
    "#0099C6",
    "#DD4477",
    "#66AA00",
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (building) {
        try {
          const response = await axios.get(
            `buildings/${building.id}/complete-info`
          );
          const wltResponse = await axios.get(
            `/workTimeLogs/get-building-logs/${building.id}`
          );
          const fetchedData = response.data.data;
          const fetchedWorkTimeLogs = wltResponse.data;
          setWorkTimeLogs(fetchedWorkTimeLogs);
          setData(fetchedData);
          calculateCosts(fetchedData, fetchedWorkTimeLogs);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      }
    };

    fetchData();
  }, [building]);

  const calculateCosts = (data, workTimeLogs) => {
    calculateChartData(data, "initialDate", setInitialCosts);
    calculateChartData(data, "date", setDateCosts);
    calculateUpdatedCosts(data, workTimeLogs);
  };

  const calculateUpdatedCosts = (data, workTimeLogs) => {
    const userHours = workTimeLogs.reduce((acc, log) => {
      acc[log.userId] = (acc[log.userId] || 0) + parseFloat(log.hours);
      return acc;
    }, {});

    const totalLaborCost = Object.entries(userHours).reduce(
      (acc, [userId, hours]) => {
        const user = data.sections
          .flatMap((section) => section.Users)
          .find((user) => user.id === parseInt(userId));
        if (user) {
          const hourlyRate = parseFloat(user.salary) / 20 / 8;
          return acc + hourlyRate * hours;
        }
        return acc;
      },
      0
    );

    setUpdatedCosts([
      {
        name: "Текущие затраты на оплату труда",
        value: Math.round(totalLaborCost),
      },
      {
        name: "Оплата субподрядным организациям",
        value: Math.round(
          data.subcontractors.reduce(
            (acc, sub) => acc + parseFloat(sub.cost),
            0
          )
        ),
      },
      {
        name: "Отчисления на социальные нужды",
        value: Math.round((totalLaborCost / 41) * 13),
      },
      {
        name: "Амортизационные отчисления",
        value: Math.round((totalLaborCost / 41) * 1.38),
      },
      {
        name: "Материальные затраты",
        value: Math.round((totalLaborCost / 41) * 1.38),
      },
      {
        name: "Прочие прямые затраты",
        value: Math.round((totalLaborCost / 41) * 7.66),
      },
      {
        name: "Налоги (на имущество, на землю)",
        value: Math.round((totalLaborCost / 41) * 3.8),
      },
      {
        name: "Затраты на содержание зданий, арендная плата",
        value: Math.round((totalLaborCost / 41) * 8.4),
      },
      {
        name: "Другие расходы",
        value: Math.round((totalLaborCost / 41) * 9.3),
      },
    ]);
  };

  const calculateChartData = (data, dateType, setChartData) => {
    const dates = data.milestones.map((m) => new Date(m[dateType]));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    let duration = 0;
    for (
      let day = new Date(minDate);
      day <= maxDate;
      day.setDate(day.getDate() + 1)
    ) {
      duration++;
    }

    const userSet = new Set();
    data.sections.forEach((section) => {
      section.Users.forEach((user) => userSet.add(user.id));
    });
    const uniqueUsers = Array.from(userSet).map((userId) => {
      return data.sections
        .flatMap((section) => section.Users)
        .find((u) => u.id === userId);
    });

    const totalLaborCost = uniqueUsers.reduce(
      (acc, user) => acc + (user.salary / 30.5) * duration,
      0
    );

    const chartData = [
      {
        name: "Оплата труда производственного персонала",
        value: Math.round(totalLaborCost),
      },
      {
        name: "Оплата субподрядным организациям",
        value: Math.round(
          data.subcontractors.reduce(
            (acc, sub) => acc + parseFloat(sub.cost),
            0
          )
        ),
      },
      {
        name: "Отчисления на социальные нужды",
        value: Math.round((totalLaborCost / 41) * 13),
      },
      {
        name: "Амортизационные отчисления",
        value: Math.round((totalLaborCost / 41) * 1.38),
      },
      {
        name: "Материальные затраты",
        value: Math.round((totalLaborCost / 41) * 1.38),
      },
      {
        name: "Прочие прямые затраты",
        value: Math.round((totalLaborCost / 41) * 7.66),
      },
      {
        name: "Налоги (на имущество, на землю)",
        value: Math.round((totalLaborCost / 41) * 3.8),
      },
      {
        name: "Затраты на содержание зданий, арендная плата",
        value: Math.round((totalLaborCost / 41) * 8.4),
      },
      {
        name: "Другие расходы",
        value: Math.round((totalLaborCost / 41) * 9.3),
      },
    ];

    setChartData(chartData);
  };

  return (
    <>
      <motion.div initial="hidden" animate="visible" variants={variants}>
        <h3 style={{ marginBottom: "16px" }}>
          <Badge style={{ marginRight: "16px" }}>{building.number}</Badge>
          {building.name}
        </h3>
      </motion.div>
      <motion.div initial="hidden" animate="visible" variants={variants}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <CustomPieChart
            verificationAmount={building.initialContractValue}
            type="Исходные данные"
            data={initialCosts}
            colors={COLORS}
          />
          <LegendComponent data={initialCosts} colors={COLORS} />
          <CustomPieChart
            verificationAmount={building.currentContractValue}
            type="Актуализированные данные"
            data={dateCosts}
            colors={COLORS}
          />
          <LegendComponent data={dateCosts} colors={COLORS} />
          <CustomPieChart
            verificationAmount={dateCosts.reduce(
              (acc, item) => acc + item.value,
              0
            )}
            type="Текущие данные"
            data={updatedCosts}
            colors={COLORS}
          />
          <LegendComponent data={updatedCosts} colors={COLORS} />
        </div>
      </motion.div>
    </>
  );
};

export default FinancialCharts;
