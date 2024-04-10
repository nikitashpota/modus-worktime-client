import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Pencil, Save } from "react-bootstrap-icons";

const EditableTextField = ({
  label,
  name,
  value,
  onChange,
  as = "input",
  rows = 1, // Установка значения по умолчанию для rows
}) => {
  const [isEditable, setIsEditable] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    onChange(e);
  };

  const toggleEdit = () => {
    setIsEditable(!isEditable);
    if (!isEditable) {
      setInputValue(value);
    }
  };

  // Рассчитываем высоту для div на основе количества строк и предполагаемой высоты строки
  // Здесь 20px - это предполагаемая высота одной строки textarea. Это значение может быть изменено в зависимости от стилей.
  const divHeight = `${rows * 20}px`;

  return (
    <Form.Group as={Row} className="align-items-center mb-3">
      <Form.Label column sm={2} style={{ fontWeight: "normal" }}>
        {label}
      </Form.Label>
      <Col sm={8}>
        {isEditable ? (
          <Form.Control
            as={as}
            rows={rows}
            name={name}
            value={inputValue}
            onChange={handleInputChange}
          />
        ) : (
          <div
            style={{
              minHeight: as === "textarea" ? divHeight : "38px",
              paddingTop: "6px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: as === "textarea" ? "pre-wrap" : "nowrap",
            }}
          >
            {value || "Не указано"}
          </div>
        )}
      </Col>
      <Col sm={2} style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant={isEditable ? "outline-success" : "outline-secondary"}
          onClick={toggleEdit}
          style={{
            width: "40px",
            height: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isEditable ? <Save /> : <Pencil />}
        </Button>
      </Col>
    </Form.Group>
  );
};

export default EditableTextField;
