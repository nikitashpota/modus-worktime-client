import React, { useState, useRef } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Pencil, Save } from "react-bootstrap-icons";

const EditableTextField = ({
  label,
  name,
  value,
  onChange,
  as = "input",
  rows,
}) => {
  const [isEditable, setIsEditable] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const contentRef = useRef(null);

  const handleContentChange = () => {
    setInputValue(contentRef.current.innerText);
  };

  const toggleEdit = () => {
    if (isEditable) {
      handleContentChange();
      if (onChange) {
        onChange({ target: { name, value: contentRef.current.innerText } });
      }
    }
    setIsEditable(!isEditable);
  };

  return (
    <Form.Group as={Row} className="d-flex align-items-center mb-3">
      <Form.Label
        column
        sm={2}
        style={{
          paddingTop: "6px",
          paddingBottom: "6px",
          fontWeight: "normal",
        }}
      >
        {label}
      </Form.Label>
      <Col sm={8}>
        <div
          ref={contentRef}
          contentEditable={isEditable}
          onBlur={handleContentChange}
          style={{
            minHeight: as === "textarea" ? `${rows * 20}px` : "38px",
            padding: "6px",
            border: isEditable ? "1px solid #ced4da" : "none",
            background: isEditable ? "#fff" : "transparent",
          }}
          dangerouslySetInnerHTML={{ __html: inputValue || "Не указано" }}
        ></div>
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
