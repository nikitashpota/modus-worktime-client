import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, InputGroup } from "react-bootstrap";
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
    <InputGroup className="mb-3">
      <Form.Control
        style={{ width: "80px", flex: "none" }}
        type="number"
        placeholder="Часы"
        max={10}
        min={0}
        value={entry.hours || ""}
        onChange={(e) => onUpdateEntry({ ...entry, hours: e.target.value })}
        id={`hours-${entry.id}`} // Уникальный id для поля ввода часов
      />
      <Form.Control
        style={{ flex: "1" }}
        type="text"
        placeholder="Описание работы"
        value={entry.workType || ""}
        onChange={(e) => onUpdateEntry({ ...entry, workType: e.target.value })}
        id={`workType-${entry.id}`} // Уникальный id для поля ввода описания работы
      />
      <Button
        variant="outline-danger"
        onClick={() => handleRemoveClick(entry.id)}
        style={{ width: "45px", flex: "none" }}
      >
        <Trash />
      </Button>
    </InputGroup>
  );
};

const WorkEntriesModal = ({
  show,
  onHide,
  logs,
  userId,
  sectionId,
  buildingId,
  date,
  onUpdateTable,
}) => {
  const [entries, setEntries] = useState(logs);

  useEffect(() => {
    setEntries(logs);
  }, [logs]);

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
      const payload = { ...entry, userId, sectionId, buildingId, date };
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
    setEntries([]);
  };

  const handleClose = async () => {
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "18px" }}>Ведомость работ</Modal.Title>
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
        <Button
          variant="outline-primary"
          onClick={addNewEntry}
          className="mb-3"
          width={80}
        >
          <PlusIcon />
        </Button>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={handleSave}>
          Готово
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WorkEntriesModal;
