import React from "react";
import {
  ListGroup,
  Button,
  Badge,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Trash, PersonPlus, Pencil, People } from "react-bootstrap-icons";
import SectionStatusBadge from "./SectionStatusBadge";

const SectionListItem = ({
  section,
  onDelete,
  onEdit,
  onAddUser,
  onShowTeam,
  showModifications,
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (!dateString) return "";

    let day = date.getDate().toString().padStart(2, "0");
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let year = date.getFullYear().toString();

    return `${day}.${month}.${year}`;
  };

  const renderTooltip = () => {
    const endDate = formatDate(section.endDate);
    if (!section.modifications || section.modifications.length === 0) {
      return (
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip>
              <div>{`Дата окончания: ${endDate}`}</div>
            </Tooltip>
          }
        >
          <div>{endDate}</div>
        </OverlayTrigger>
      );
    }

    const latestDate = new Date(section.endDate);
    let latestModification = {
      number: 0,
      date: latestDate,
    };

    section.modifications.forEach((mod, index) => {
      const modDate = new Date(mod.date);
      if (modDate > latestModification.date) {
        latestModification = { number: mod.number, date: modDate };
      }
    });

    return (
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip>
            <div>{`Дата окончания: ${endDate}`}</div>
            {section.modifications.map((mod, index) => (
              <div key={index}>
                {`Изм. ${mod.number}: ${new Date(mod.date).toLocaleDateString(
                  "ru-RU"
                )}`}
              </div>
            ))}
          </Tooltip>
        }
      >
        <div>
          {latestModification.number > 0 ? (
            <>
              Изм. {latestModification.number} <br />
              {formatDate(latestModification.date)}
            </>
          ) : (
            <>{formatDate(latestModification.date)}</>
          )}
        </div>
      </OverlayTrigger>
    );
  };

  // const renderTooltip = () => {
  //   const endDate = formatDate(section.endDate);
  //   if (!section.modifications || section.modifications.length === 0) {
  //     return (
  //       <div>
  //         <div>{`Дата окончания: ${endDate}`}</div>
  //       </div>
  //     );
  //   }

  //   const endDateObject = new Date(section.endDate);
  //   const filteredModifications = section.modifications.filter(
  //     (mod) => new Date(mod.date) > endDateObject
  //   );

  //   return (
  //     <div>
  //       <div>{`Дата окончания: ${endDate}`}</div>
  //       {filteredModifications.map((mod, index) => (
  //         <div key={index}>
  //           {`Изм. ${mod.number}: ${new Date(mod.date).toLocaleDateString(
  //             "ru-RU"
  //           )}`}
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };

  const renderModifications = () => {
    if (!section.modifications || section.modifications.length === 0) {
      return null;
    }

    return section.modifications.map((mod, index) => (
      <div key={index} style={{ paddingLeft: "20px", paddingTop: "5px" }}>
        Дата выпуска Изм. {mod.number}: {formatDate(mod.date)}
      </div>
    ));
  };

  return (
    <>
      <ListGroup.Item
        className="d-flex justify-content-between align-items-end"
        style={{ borderRight: "1px solid #dee2e6", position: "relative", minHeight: "65px" }}
      >
        <SectionStatusBadge
          status={section.status}
          position={{ top: "10px", left: "10px" }}
        />
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
          {renderTooltip()}
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
          <Button
            variant="outline-secondary"
            onClick={() => onShowTeam(section.id)}
            style={{ position: "relative" }}
            disabled={section.userCount > 0 ? false : true}
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
          <Button
            variant="outline-success"
            onClick={() => onAddUser(section.id)}
          >
            <PersonPlus />
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => onEdit(section.id)}
          >
            <Pencil />
          </Button>
          <Button variant="outline-danger" onClick={() => onDelete(section.id)}>
            <Trash />
          </Button>
        </div>
      </ListGroup.Item>
      {showModifications && section.modifications.length > 0 && (
        <ListGroup.Item>
          <div style={{ paddingLeft: "10px", paddingTop: "10px" }}>
            <div>Дата выпуска раздела: {formatDate(section.endDate)}</div>
            {renderModifications()}
          </div>
        </ListGroup.Item>
      )}
    </>
  );
};

export default SectionListItem;
