// components/SubcontractorList.jsx
import React, { useState, useEffect } from "react";
import { ListGroup, Button, Modal, Form } from "react-bootstrap";
import axios from "../services/axios";
import { Trash, Pencil } from "react-bootstrap-icons";
import AddSubcontractorModal from "./AddSubcontractorModal";
import SubcontractorListItem from "./SubcontractorListItem";

const SubcontractorList = ({ buildingId }) => {
  const [subcontractors, setSubcontractors] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editableSubcontractor, setEditableSubcontractor] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchSubcontractors();
  }, [buildingId]);

  const fetchSubcontractors = async () => {
    try {
      const response = await axios.get(
        `/subcontractors/by-building/${buildingId}`
      );
      setSubcontractors(response.data);
    } catch (error) {
      console.error("Ошибка при получении субподрядчиков:", error);
    }
  };

  const handleEdit = (subcontractor) => {
    setEditableSubcontractor(subcontractor);
    setShowEditModal(true);
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(
        `/subcontractors/${editableSubcontractor.id}`,
        editableSubcontractor
      );
      fetchSubcontractors();
      setShowEditModal(false);
    } catch (error) {
      console.error("Ошибка при сохранении изменений:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/subcontractors/${id}`);
      fetchSubcontractors();
    } catch (error) {
      console.error("Ошибка при удалении субподрядчика:", error);
    }
  };

  const handleAddSubcontractor = async (newSubcontractor) => {
    try {
      const response = await axios.post("/subcontractors", {
        ...newSubcontractor,
        buildingId,
      });
      setSubcontractors([...subcontractors, response.data]);
    } catch (error) {
      console.error("Error adding subcontractor:", error);
    }
  };

  return (
    <>
      <div style={{ marginBottom: "16px" }}>
        <Button variant="outline-primary" onClick={() => setShowAddModal(true)}>
          Добавить субподрядчика
        </Button>
      </div>
      <AddSubcontractorModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onAdd={handleAddSubcontractor}
      />
      <ListGroup>
        {subcontractors.map((sub) => (
          <SubcontractorListItem
            key={sub.id}
            sub={sub}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ))}
      </ListGroup>
      {showEditModal && (
        <Modal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Редактирование субподрядчика</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Наименование субподрядчика</Form.Label>
                <Form.Control
                  type="textarea"
                  value={editableSubcontractor.name}
                  onChange={(e) =>
                    setEditableSubcontractor({
                      ...editableSubcontractor,
                      name: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Стоимость (тыс. р.)</Form.Label>
                <Form.Control
                  type="number"
                  value={editableSubcontractor.cost}
                  onChange={(e) =>
                    setEditableSubcontractor({
                      ...editableSubcontractor,
                      cost: parseFloat(e.target.value),
                    })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Закрыть
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Сохранить изменения
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default SubcontractorList;
