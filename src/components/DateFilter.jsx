import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

const DateFilter = ({ onFilter }) => {
  // Получаем первый и последний день текущего месяца
  useEffect(() => {
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

    setStartDate(firstDayCurrentMonth);
    setEndDate(lastDayCurrentMonth);
  }, []);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Функция обработки нажатия на кнопку "Применить"
  const applyFilter = () => {
    onFilter({ startDate, endDate });
  };

  return (
    <Form>
      <Row className="align-items-center">
        <Col xs="auto">
          <Form.Label htmlFor="startDate" visuallyHidden>
            Начальная дата
          </Form.Label>
          <Form.Control
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Col>
        <Col xs="auto">
          <Form.Label htmlFor="endDate" visuallyHidden>
            Конечная дата
          </Form.Label>
          <Form.Control
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Col>
        <Col xs="auto">
          <Button onClick={applyFilter} type="button">
            Применить
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default DateFilter;
