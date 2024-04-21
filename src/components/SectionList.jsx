import React, { useState, useEffect } from "react";
import { ListGroup, Button } from "react-bootstrap";
import axios from "../services/axios";
import SectionListItem from "./SectionListItem";
import AddSectionModal from "./AddSectionModal";
import EditSectionModal from "./EditSectionModal";
import LoadTemplateModal from "./LoadTemplateModal";
import templates from "../services/templates.json";

const SectionList = ({ stage, buildingId }) => {
  const [sections, setSections] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editableSection, setEditableSection] = useState({
    sectionCode: "",
    sectionName: "",
    startDate: "",
    endDate: "",
  });
  const [newSection, setNewSection] = useState({
    sectionCode: "",
    sectionName: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchSections();
  }, [stage, buildingId]);

  const fetchSections = async () => {
    try {
      const response = await axios.get(
        `/sections?stage=${stage}&buildingId=${buildingId}`
      );
      setSections(
        response.data.sort((a, b) => {
          return a.sectionCode.localeCompare(b.sectionCode);
        })
      );
    } catch (error) {
      console.error("Ошибка при получении разделов:", error);
    }
  };

  const handleEdit = (sectionId) => {
    const section = sections.find((sec) => sec.id === sectionId);
    setEditableSection(section);
    setShowEditModal(true);
  };

  const handleSaveChanges = async () => {
    const url = `/sections/${editableSection.id}`;
    console.log("Sending PUT request to:", url, "with data:", editableSection);
    try {
      await axios.put(url, editableSection);
      const updatedSections = sections.map((sec) =>
        sec.id === editableSection.id ? { ...sec, ...editableSection } : sec
      );
      setSections(updatedSections);
      setShowEditModal(false);
    } catch (error) {
      console.error("Ошибка при сохранении изменений:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/sections/${id}`);
      setSections(sections.filter((section) => section.id !== id));
    } catch (error) {
      console.error("Ошибка при удалении раздела:", error);
    }
  };

  const handleAddUser = (sectionId) => {
    console.log("Add user to section", sectionId);
    // Функция заглушка для добавления пользователя
  };

  const handleChangeNewSection = (e) => {
    const { name, value } = e.target;
    setNewSection((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeEditSection = (e) => {
    const { name, value } = e.target;
    setEditableSection((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSection = async () => {
    try {
      const response = await axios.post("/sections", {
        ...newSection,
        stage,
        buildingId,
      });
      setSections([...sections, response.data]);
      setShowAddModal(false);
      setNewSection({
        sectionCode: "",
        sectionName: "",
        startDate: "",
        endDate: "",
      });
    } catch (error) {
      console.error("Ошибка при добавлении раздела:", error);
    }
  };

  const handleLoadTemplate = async (template) => {
    try {
      // Отправить запрос на сервер для удаления существующих и добавления новых разделов
      await axios.post(`/sections/loadTemplate`, {
        stage,
        buildingId,
        sections: template.sections,
      });
      fetchSections(); // Перезагрузить разделы после обновления
      setShowTemplateModal(false);
    } catch (error) {
      console.error("Ошибка при загрузке шаблона:", error);
    }
  };

  return (
    <>
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          flexDirection: "row",
          gap: "8px",
        }}
      >
        <Button variant="outline-primary" onClick={() => setShowAddModal(true)}>
          Добавить раздел
        </Button>
        <Button
          variant="outline-secondary"
          onClick={() => setShowTemplateModal(true)}
        >
          Загрузить шаблон
        </Button>
      </div>
      <ListGroup>
        {sections.map((section) => (
          <SectionListItem
            key={section.id}
            section={section}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onAddUser={handleAddUser}
          />
        ))}
      </ListGroup>
      <AddSectionModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        newSection={newSection}
        onChange={handleChangeNewSection}
        onAdd={handleAddSection}
      />
      <EditSectionModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        section={editableSection}
        onChange={handleChangeEditSection}
        onSave={handleSaveChanges}
      />
      <LoadTemplateModal
        show={showTemplateModal}
        onHide={() => setShowTemplateModal(false)}
        templates={templates}
        onLoadTemplate={handleLoadTemplate}
      />
    </>
  );
};

export default SectionList;
