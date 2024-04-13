import React, { useState, useRef, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { Pencil, Save } from "react-bootstrap-icons";

const EditableTextField = ({ label, name, value, onChange }) => {
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
    <div
      style={{
        display: "flex",
        alignItems: "start",
        marginBottom: "16px",
        gap: "16px",
      }}
    >
      <label
        style={{
          minWidth: "150px",
          fontWeight: "500",
          paddingBottom: "7px",
          paddingTop: "7px",
        }}
      >
        {label}
      </label>
      <div
        style={{
          flexGrow: 1,
          padding: "6px",
          background: isEditable ? "#fff" : "transparent",
          border: isEditable ? "1px solid #ced4da" : "1px solid #ffffff",
        }}
      >
        <div
          ref={contentRef}
          contentEditable={isEditable}
          onBlur={handleContentChange}
          style={{ minHeight: "100%", outline: 0 }}
          dangerouslySetInnerHTML={{ __html: inputValue || "Не указано" }}
        ></div>
      </div>
      <div style={{ minWidth: "50px" }}>
        <Button
          variant={isEditable ? "outline-success" : "outline-primary"}
          onClick={toggleEdit}
          style={{
            height: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isEditable ? <Save /> : <Pencil />}
        </Button>
      </div>
    </div>
  );
};

export default EditableTextField;
