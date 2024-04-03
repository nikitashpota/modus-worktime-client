import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { PlusLg as PlusIcon, Trash } from "react-bootstrap-icons";
import axios from "../services/axios";

const WorkEntryRow = ({ entry, onUpdateEntry, onRemoveEntry }) => {
  const handleRemoveClick = async (id) => {
    onRemoveEntry(id);
    try {
      // Отправка запроса на удаление записи
      await axios.delete(`/workTimeLogs/${id}`);
      console.log(`Запись с id=${id} успешно удалена`);
    } catch (error) {
      console.error("Ошибка при удалении записи:", error);
    }
  };

  return (
    <Form.Group
      as={Row}
      className="mb-3 g-0"
      controlId={`entry-${entry.id}`}
      style={{ gap: "15px" }}
    >
      <Col style={{ maxWidth: "100px" }}>
        <Form.Control
          type="number"
          placeholder="Часы"
          value={entry.hours || ""}
          onChange={(e) => onUpdateEntry({ ...entry, hours: e.target.value })}
        />
      </Col>
      <Col>
        <Form.Control
          type="textarea"
          placeholder="Описание работы"
          value={entry.workType || ""}
          onChange={(e) =>
            onUpdateEntry({ ...entry, workType: e.target.value })
          }
        />
      </Col>
      <Col xs="auto" className="d-flex justify-content-center">
        <Button variant="danger" onClick={() => handleRemoveClick(entry.id)}>
          <Trash />
        </Button>
      </Col>
    </Form.Group>
  );
};

const WorkEntriesModal = ({
  show,
  onHide,
  logs,
  userId,
  buildingId,
  date,
  onUpdateTable,
}) => {
  const [entries, setEntries] = useState(logs);

  const addNewEntry = () => {
    setEntries([
      ...entries,
      { id: `new-${Date.now()}`, hours: "", workType: "" },
    ]);
  };

  const updateEntry = (updatedEntry) => {
    setEntries(
      entries.map((entry) =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    );
  };

  const removeEntry = (entryId) => {
    setEntries(entries.filter((entry) => entry.id !== entryId));
  };

  const handleSave = async () => {
    for (const entry of entries) {
      const payload = { ...entry, userId, buildingId, date };
      if (entry.id.toString().startsWith("new-")) {
        try {
          // Создание новой записи
          console.log("Создание новой записи", payload);
          delete payload.id;
          await axios.post("/workTimeLogs", payload);
        } catch (error) {
          console.error("Ошибка при создании новой записи:", error);
        }
      } else {
        try {
          // Обновление существующей записи
          await axios.put(`/workTimeLogs/${entry.id}`, payload);
        } catch (error) {
          console.error("Ошибка при обновлении записи:", error);
        }
      }
    }
    onUpdateTable();
    onHide();
  };

  const handleClose = async () => {
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Добавление работ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {entries.map((entry) => {
          return (
            <WorkEntryRow
              key={entry.id}
              entry={entry}
              onUpdateEntry={updateEntry}
              onRemoveEntry={removeEntry}
            />
          );
        })}
        <Button variant="primary" onClick={addNewEntry} className="mb-3">
          <PlusIcon />
        </Button>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Закрыть
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Готово
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WorkEntriesModal;
