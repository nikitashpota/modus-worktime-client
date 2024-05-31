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
  });
  const [newSection, setNewSection] = useState({
    sectionCode: "",
    sectionName: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchSections();
  }, [stage, buildingId, filter]);

  const fetchSections = async () => {
    try {
      const response = await axios.get(
        `/sections/by-stage-building?stage=${stage}&buildingId=${buildingId}`
      );
      const sectionsData = response.data;

      // Fetch user count for each section
      const sectionsWithUserCount = await Promise.all(
        sectionsData.map(async (section) => {
          const userCountResponse = await axios.get(
            `/sections/${section.id}/assigned-users/count`
          );
          return {
            ...section,
            userCount: userCountResponse.data.count,
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
    setEditableSection(section);
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
    setEditableSection((prev) => ({ ...prev, [name]: value }));
  };

  //Функция добавить раздел
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
      fetchSections();
    } catch (error) {
      console.error("Ошибка при добавлении раздела:", error);
    }
  };
  // Функция загрузки разделов по шаблону
  const handleLoadTemplate = async (template) => {
    try {
      await axios.post(`/sections/loadTemplate`, {
        stage,
        buildingId,
        sections: template,
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

  // Функция для открытия модального окна и загрузки данных
  const handleShowTeam = async (sectionId) => {
    try {
      const response = await axios.get(`/sections/${sectionId}/assigned-users`);
      const users = response.data;
      // Группировка пользователей по департаменту и сортировка по фамилии
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

  // Функция для закрытия модального окна
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
        <Form inline>
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
