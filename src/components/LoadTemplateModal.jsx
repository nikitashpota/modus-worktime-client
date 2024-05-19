import React, { useState } from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";
import * as XLSX from "xlsx";

const LoadTemplateModal = ({ show, onHide, onLoadTemplate }) => {
  const [fileData, setFileData] = useState([]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary", cellDates: true });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false });
      const templates = formatData(data);
      setFileData(templates);
    };
    reader.readAsBinaryString(file);
  };

  const formatData = (data) => {
    return data
      .slice(1)
      .filter((row) => row.length === 4 && row.every((cell) => cell != null))
      .map((row) => ({
        sectionCode: row[0],
        sectionName: row[1],
        startDate: formatDate(row[2]),
        endDate: formatDate(row[3]),
      }));
  };

  const formatDate = (date) => {
    if (date instanceof Date) {
      return date.toISOString().slice(0, 10);
    }
    return date; // Если уже в строковом формате
  };

  const handleSubmit = () => {
    onLoadTemplate(fileData);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Загрузите и обработайте шаблон</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input type="file" accept=".xlsx, .xls" onChange={handleFile} />
        {fileData.length > 0 && (
          <ListGroup style={{ marginTop: "16px" }}>
            {fileData.map((template, index) => (
              <ListGroup.Item key={index}>
                {template.sectionName} - от {template.startDate} до{" "}
                {template.endDate}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Отмена
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Готово
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoadTemplateModal;
