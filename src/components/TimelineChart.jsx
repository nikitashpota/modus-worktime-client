import { useEffect, useState, useCallback } from "react";
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
  const { cx, cy, stroke, payload, index } = props;
  const yOffset = index % 2 === 0 ? 35 : -20;
  const circleStroke = payload.status === "Завершено" ? "green" : "none";
  if (payload.code) {
    return (
      <>
        <g>
          <circle
            cx={cx}
            cy={cy}
            r={6}
            fill={stroke}
            stroke={circleStroke}
            strokeWidth={3}
          />
        </g>
        <foreignObject x={cx - 30} y={cy - yOffset} width="60" height="35">
          <div
            style={{
              backgroundColor: "white",
              textAlign: "center",
              borderRadius: "3px",
              fontSize: "12px",
            }}
          >
            {payload.code}
          </div>
        </foreignObject>
      </>
    );
  }

  return null;
};

const CustomTooltip = ({ active, payload, typeDate }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    if (data.name === "Empty") return null;
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
        {!data.hours && (
          <div style={{ margin: 0 }}>
            {new Date(data?.date).toLocaleDateString()}
            {typeDate === "ActualDate" ? (
              <div style={{ margin: 0 }}>
                <p style={{ margin: 0 }}>
                  Разница дат:{" "}
                  {differenceInDays(
                    parseISO(data?.actualDate),
                    parseISO(data?.amendedDate)
                  )}{" "}
                  дн. (
                  {differenceInDays(
                    parseISO(data?.actualDate),
                    parseISO(data?.initialDate)
                  )}{" "}
                  дн.)
                </p>
                <p style={{ margin: 0 }}>{data?.userResponsibleForUpdate}</p>
                <p style={{ margin: 0 }}>{data?.updatedDateChangeReason}</p>
              </div>
            ) : typeDate === "AmendedDate" ? (
              <div style={{ margin: 0 }}>
                <p style={{ margin: 0 }}>
                  Разница дат:{" "}
                  {differenceInDays(
                    parseISO(data?.amendedDate),
                    parseISO(data?.initialDate)
                  )}{" "}
                  дн.
                </p>
                <p style={{ margin: 0 }}>{data?.userResponsibleForChange}</p>
                <p style={{ margin: 0 }}>{data?.dateChangeReason}</p>
              </div>
            ) : (
              <div style={{ margin: 0 }}>
                <p style={{ margin: 0 }}>
                  {data?.userResponsibleForInitialDate}
                </p>
                <p style={{ margin: 0 }}>{data?.initialDateChangeReason}</p>
              </div>
            )}
          </div>
        )}
        {data.hours > 0 && (
          <>
            <p style={{ margin: 0 }}>Кол-во часов: {data.hours} ч.</p>
            <p style={{ margin: 0 }}>
              {new Date(data?.date).toLocaleDateString()}
            </p>
          </>
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
  typeDate,
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
      if (milestone.name === "Empty" && milestone.type.includes(typeDate))
        return;
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
      const dateRange = {
        start: parseISO(milestones[0].date),
        end: parseISO(milestones[milestones.length - 1].date),
      };

      const modifiedData = milestones.map((item) => ({
        ...item,
        initialDate: item.initialDate,
        amendedDate: item.date,
        actualDate: item.updatedDate,
        date:
          typeDate === "ActualDate"
            ? parseISO(item.updatedDate).getTime()
            : typeDate === "InitialDate"
            ? parseISO(item.initialDate).getTime()
            : parseISO(item.date).getTime(),
        y: 0,
      }));

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
        <Tooltip content={<CustomTooltip typeDate={typeDate} />} />
        <Bar dataKey="hours" fill="#a6cbff" />
        <Line
          type="monotone"
          dataKey="y"
          stroke={colorLine}
          strokeWidth={5}
          dot={(props) => <CustomDot {...props} index={props.index} />}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default TimelineChart;
