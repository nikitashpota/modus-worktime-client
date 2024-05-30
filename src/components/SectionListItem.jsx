import React from "react";
import { ListGroup, Button, Badge } from "react-bootstrap";
import { Trash, PersonPlus, Pencil, People } from "react-bootstrap-icons";

const SectionListItem = ({
  section,
  onDelete,
  onEdit,
  onAddUser,
  onShowTeam,
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (!dateString) return "";

    let day = date.getDate().toString().padStart(2, "0");
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let year = date.getFullYear().toString().slice(2);

    return `${day}.${month}.${year}`;
  };

  return (
    <ListGroup.Item
      className="d-flex justify-content-between align-items-center"
      style={{ borderRight: "1px solid #dee2e6" }}
    >
      <div style={{ minWidth: "180px", paddingRight: "10px" }}>
        {section.sectionCode}
      </div>
      <div style={{ flexGrow: 1, padding: "0 10px" }}>
        {section.sectionName}
      </div>
      <div style={{ minWidth: "100px", padding: "0 10px" }}>
        {formatDate(section.startDate)}
      </div>
      <div style={{ minWidth: "100px", padding: "0 10px" }}>
        {formatDate(section.endDate)}
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
        <Button
          variant="outline-info"
          onClick={() => onShowTeam(section.id)}
          style={{ position: "relative" }}
        >
          <People />
          {section.userCount > 0 && (
            <Badge
              style={{ position: "absolute", top: "60%", left: "60%" }}
              pill
              variant="primary"
            >
              {section.userCount}
            </Badge>
          )}
        </Button>
        <Button variant="outline-success" onClick={() => onAddUser(section.id)}>
          <PersonPlus />
        </Button>
        <Button variant="outline-secondary" onClick={() => onEdit(section.id)}>
          <Pencil />
        </Button>
        <Button variant="outline-danger" onClick={() => onDelete(section.id)}>
          <Trash />
        </Button>
      </div>
    </ListGroup.Item>
  );
};

export default SectionListItem;
