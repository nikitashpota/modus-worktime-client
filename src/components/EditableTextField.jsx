import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { Pencil, Save } from "react-bootstrap-icons";
import { useAuth } from "../services/AuthContext";

const EditableTextField = ({
  type = "text",
  label,
  name,
  value = "",
  onChange,
  options = null,
}) => {
  const [isEditable, setIsEditable] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const { userRole } = useAuth();

  // Обновление локального состояния при изменении внешнего value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const toggleEdit = () => {
    if (isEditable && onChange) {
      onChange({ target: { name, value: inputValue } }); // Trigger onChange only when saving changes
    }
    setIsEditable(!isEditable);
  };

  return (
    <Form.Group
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "16px",
        gap: "10px",
      }}
    >
      <Form.Label
        style={{ minWidth: "450px", maxWidth: "450px", fontWeight: "500" }}
      >
        {label}
      </Form.Label>
      {type === "textarea" ? (
        <Form.Control
          as="textarea"
          name={name}
          value={inputValue || ""}
          onChange={handleInputChange}
          rows={3}
          readOnly={!isEditable}
        />
      ) : type === "select" && options ? (
        <Form.Control
          as="select"
          name={name}
          value={inputValue || null}
          onChange={handleInputChange}
          disabled={!isEditable}
          style={{ whiteSpace: "normal", height: "auto", maxWidth: "100%" }}
        >
          {Object.entries(options).map(([key, text]) => (
            <option
              key={key}
              value={key}
              style={{ whiteSpace: "normal", height: "auto", maxWidth: "100%" }}
            >
              {text}
            </option>
          ))}
        </Form.Control>
      ) : (
        <Form.Control
          type={type === "number" ? "number" : "text"}
          name={name}
          value={type === "number" ? inputValue || null : inputValue || ""}
          onChange={handleInputChange}
          readOnly={!isEditable}
        />
      )}

      <Button
        disabled={userRole === "Проектировщик" ? true : false}
        variant={isEditable ? "outline-success" : "outline-primary"}
        onClick={toggleEdit}
      >
        {isEditable ? <Save /> : <Pencil />}
      </Button>
    </Form.Group>
  );
};

export default EditableTextField;
