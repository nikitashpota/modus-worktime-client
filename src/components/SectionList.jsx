import { useState, useEffect } from "react";
import { ListGroup, Button, Form, FormControl } from "react-bootstrap";
import axios from "../services/axios";
import SectionListItem from "./SectionListItem";
import AddSectionModal from "./AddSectionModal";
import EditSectionModal from "./EditSectionModal";
import LoadTemplateModal from "./LoadTemplateModal";
import AssignUserToSectionModal from "./AssignUserToSectionModal";
import ProjectTeamModal from "./ProjectTeamModal";
import templates from "../services/templates.json";

const SectionList = ({ stage, buildingId }) => {
  const [sections, setSections] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [filter, setFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const [editableSection, setEditableSection] = useState({
    sectionCode: "",
    sectionName: "",
    startDate: "",
    endDate: "",
    modifications: [],
    newModificationDate: "",
  });
  const [newSection, setNewSection] = useState({
    sectionCode: "",
    sectionName: "",
    startDate: "",
    endDate: "",
    modifications: [],
  });
  const [showModifications, setShowModifications] = useState(false);

  useEffect(() => {
    fetchSections();
  }, [stage, buildingId, filter]);

  const fetchSections = async () => {
    try {
      const response = await axios.get(
        `/sections/by-stage-building?stage=${stage}&buildingId=${buildingId}`
      );
      const sectionsData = response.data;

      const sectionsWithUserCount = await Promise.all(
        sectionsData.map(async (section) => {
          const userCountResponse = await axios.get(
            `/sections/${section.id}/assigned-users/count`
          );
          return {
            ...section,
            userCount: userCountResponse.data.count,
            modifications: section.modifications || [],
          };
        })
      );

      const sortedSections = sectionsWithUserCount.sort((a, b) =>
        a.sectionCode.localeCompare(b.sectionCode)
      );
      setSections(sortedSections);
      setFilteredSections(
        sortedSections.filter((section) => section.sectionCode.includes(filter))
      );
    } catch (error) {
      console.error("Ошибка при получении разделов:", error);
    }
  };

  const handleEdit = (sectionId) => {
    const section = sections.find((sec) => sec.id === sectionId);
    setEditableSection({
      ...section,
      modifications: section.modifications || [],
    });
    setShowEditModal(true);
  };

  const handleSaveChanges = async () => {
    const url = `/sections/${editableSection.id}`;
    try {
      await axios.put(url, editableSection);
      const updatedSections = sections.map((sec) =>
        sec.id === editableSection.id ? { ...sec, ...editableSection } : sec
      );
      setSections(updatedSections);
      setShowEditModal(false);
      fetchSections();
    } catch (error) {
      console.error("Ошибка при сохранении изменений:", error);
    }
  };

  const handleAddModification = async () => {
    if (!editableSection.newModificationDate) return;

    const url = `/sections/${editableSection.id}/add-modification`;
    try {
      await axios.post(url, { date: editableSection.newModificationDate });
      const updatedSection = {
        ...editableSection,
        modifications: [
          ...editableSection.modifications,
          { date: editableSection.newModificationDate },
        ],
        newModificationDate: "",
      };
      setEditableSection(updatedSection);
    } catch (error) {
      console.error("Ошибка при добавлении изменения:", error);
    }
  };

  const handleDeleteModification = (index) => {
    const updatedModifications = editableSection.modifications
      .filter((_, idx) => idx !== index)
      .map((mod, idx) => ({
        ...mod,
        number: idx + 1,
      }));

    const updatedSection = {
      ...editableSection,
      modifications: updatedModifications,
    };
    setEditableSection(updatedSection);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/sections/${id}`);
      setFilteredSections(sections.filter((section) => section.id !== id));
      fetchSections();
    } catch (error) {
      console.error("Ошибка при удалении раздела:", error);
    }
  };

  const handleAddUser = (sectionId) => {
    setCurrentSectionId(sectionId);
    setShowAssignModal(true);
  };

  const handleChangeNewSection = (e) => {
    const { name, value } = e.target;
    setNewSection((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeEditSection = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("modifications")) {
      const [_, index, field] = name.split(/[.[\]]/).filter(Boolean);
      const updatedModifications = editableSection.modifications.map(
        (mod, idx) =>
          idx === parseInt(index) ? { ...mod, [field]: value } : mod
      );
      setEditableSection((prev) => ({
        ...prev,
        modifications: updatedModifications,
      }));
    } else {
      setEditableSection((prev) => ({ ...prev, [name]: value }));
    }
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
        modifications: [],
      });
      fetchSections();
    } catch (error) {
      console.error("Ошибка при добавлении раздела:", error);
    }
  };

  const handleLoadTemplate = async (templates, action) => {
    try {
      await axios.post(`/sections/loadTemplate`, {
        stage,
        buildingId,
        sections: templates,
        action,
      });
      fetchSections();
      setShowTemplateModal(false);
    } catch (error) {
      console.error("Ошибка при загрузке шаблона:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);

  const handleShowTeam = async (sectionId) => {
    try {
      const response = await axios.get(`/sections/${sectionId}/assigned-users`);
      const users = response.data;
      const groupedUsers = users.reduce((acc, user) => {
        const { department } = user;
        if (!acc[department]) acc[department] = [];
        acc[department].push(user);
        return acc;
      }, {});

      for (const dept in groupedUsers) {
        groupedUsers[dept].sort((a, b) => a.lastName.localeCompare(b.lastName));
      }

      setTeamMembers(groupedUsers);
      setShowTeamModal(true);
    } catch (error) {
      console.error("Ошибка при получении пользователей:", error);
    }
  };

  const handleCloseTeamModal = () => {
    setShowTeamModal(false);
    setTeamMembers([]);
  };

  return (
    <>
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          flexDirection: "row",
          gap: "8px",
          alignItems: "center",
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
        <Button
          style={{ width: "210px" }}
          variant="outline-secondary"
          onClick={() => setShowModifications(!showModifications)}
        >
          {showModifications ? "Свернуть историю" : "Развернуть историю"}
        </Button>
        <div style={{ flexGrow: 1 }} />
        <Form inline style={{ marginLeft: "auto" }}>
          <FormControl
            type="text"
            placeholder="Фильтр по коду раздела"
            className="mr-sm-2"
            value={filter}
            onChange={handleFilterChange}
          />
        </Form>
      </div>

      <ListGroup>
        {filteredSections.map((section) => (
          <SectionListItem
            key={section.id}
            section={section}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onAddUser={handleAddUser}
            onShowTeam={handleShowTeam}
            showModifications={showModifications}
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
        onAddModification={handleAddModification}
        onDeleteModification={handleDeleteModification}
      />
      <LoadTemplateModal
        show={showTemplateModal}
        onHide={() => setShowTemplateModal(false)}
        templates={templates}
        onLoadTemplate={handleLoadTemplate}
        fetchSections={fetchSections}
      />

      <AssignUserToSectionModal
        show={showAssignModal}
        onHide={() => setShowAssignModal(false)}
        sectionId={currentSectionId}
        buildingId={buildingId}
      />
      <ProjectTeamModal
        show={showTeamModal}
        onHide={handleCloseTeamModal}
        teamMembers={teamMembers}
      />
    </>
  );
};

export default SectionList;
