import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { parseISO, isWithinInterval, differenceInDays } from "date-fns";

const CustomDot = (props) => {
  const { cx, cy, stroke, payload } = props;
  if (payload.code) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={10} fill={stroke} stroke="none" />
        <text x={cx} y={cy - 10} dy={-10} textAnchor="middle" fill="#666">
          {payload.code}
        </text>
      </g>
    );
  }
};

const CustomTooltip = ({ active, payload, isActualUpdate }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: "#fff",
          padding: "5px",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      >
        <p style={{ margin: 0 }}>{data.name}</p>
        <p style={{ margin: 0 }}>
          {new Date(data.date).toLocaleDateString()} Р.дат:{" "}
          <span
            style={{
              color:
                differenceInDays(
                  parseISO(data.updatedDate),
                  parseISO(data.begginDate)
                ) > 0
                  ? "red"
                  : "green",
            }}
          >
            {differenceInDays(
              parseISO(data.updatedDate),
              parseISO(data.begginDate)
            )}
          </span>
        </p>
        {data.hours > 0 && (
          <p style={{ margin: 0 }}>Кол-во часов: {data.hours} ч.</p>
        )}
        {/* {isActualUpdate && <p style={{ margin: 0 }}>{}</p>} */}
        {isActualUpdate && (
          <p style={{ margin: 0 }}>{data.userResponsibleForUpdate}</p>
        )}
        {isActualUpdate && (
          <p style={{ margin: 0 }}>{data.updatedDateChangeReason}</p>
        )}
      </div>
    );
  }

  return null;
};

const TimelineChart = ({
  milestones = [],
  workTimeLogs = [],
  height = 100,
  colorLine = "#007bff",
  update,
  isActualUpdate = false,
}) => {
  const [combinedData, setCombinedData] = useState([]);
  if (workTimeLogs.length > 0) height = 200;

  const combineData = useCallback((hoursData, milestonesData) => {
    const combined = {};
    hoursData.forEach((log) => {
      const dateKey = parseISO(log.date).getTime();
      combined[dateKey] = {
        date: dateKey,
        hours: parseFloat(log.hours),
        y: 0,
      };
    });

    milestonesData.forEach((milestone) => {
      const dateKey = milestone.date;
      if (combined[dateKey]) {
        combined[dateKey] = {
          ...combined[dateKey],
          ...milestone,
          hours: combined[dateKey].hours,
          y: 0,
        };
      } else {
        combined[dateKey] = {
          ...milestone,
          hours: 0,
          y: 0,
        };
      }
    });

    return Object.values(combined).sort((a, b) => a.date - b.date);
  }, []);

  useEffect(() => {
    if (milestones.length > 0) {
      const modifiedData = milestones.map((item) => ({
        ...item,
        begginDate: item.date,
        date: isActualUpdate
          ? parseISO(item.updatedDate).getTime()
          : parseISO(item.date).getTime(),
        y: 0,
      }));

      const dateRange = {
        start: isActualUpdate
          ? parseISO(milestones[0].updatedDate)
          : parseISO(milestones[0].date),
        end: isActualUpdate
          ? parseISO(milestones[milestones.length - 1].updatedDate)
          : parseISO(milestones[milestones.length - 1].date),
      };

      const hoursByDate = Object.values(
        workTimeLogs
          .filter((log) => isWithinInterval(parseISO(log.date), dateRange))
          .reduce((acc, curr) => {
            const dateKey = parseISO(curr.date).toISOString().slice(0, 10);
            if (!acc[dateKey]) {
              acc[dateKey] = { date: dateKey, hours: 0 };
            }
            acc[dateKey].hours += parseFloat(curr.hours);
            return acc;
          }, {})
      );

      setCombinedData(combineData(hoursByDate, modifiedData));
    }
  }, [milestones, update]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart
        data={combinedData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis
          tick={false}
          type="number"
          dataKey="date"
          domain={["dataMin", "dataMax"]}
        />
        <YAxis hide={true} domain={[0, 20]} />
        <Tooltip content={<CustomTooltip isActualUpdate={isActualUpdate} />} />
        <Bar dataKey="hours" fill="#a6cbff" barSize={15} />
        <Line
          type="monotone"
          dataKey="y"
          stroke={colorLine}
          strokeWidth={5}
          dot={<CustomDot />}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default TimelineChart;
