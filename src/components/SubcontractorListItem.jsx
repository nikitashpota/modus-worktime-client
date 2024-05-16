import { ListGroup, Button } from "react-bootstrap";
import { Pencil, Trash } from "react-bootstrap-icons";

const SubcontractorListItem = ({ sub, handleEdit, handleDelete }) => {
  return (
    <ListGroup.Item
      className="d-flex justify-content-between align-items-center"
      style={{ gap: "6px" }}
    >
      <div style={{ flex: 1, minWidth: "0" }}>{sub.name}</div>
      <div
        style={{ display: "flex", gap: "6px" }}
        className="align-items-center"
      >
        <div style={{ width: "180px", textAlign: "right", margin: "0 32px" }}>
          {`${sub.cost.toLocaleString()} тыс. р.`}
        </div>
        <Button variant="outline-secondary" onClick={() => handleEdit(sub)}>
          <Pencil />
        </Button>
        <Button variant="outline-danger" onClick={() => handleDelete(sub.id)}>
          <Trash />
        </Button>
      </div>
    </ListGroup.Item>
  );
};

export default SubcontractorListItem;
