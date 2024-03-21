// import React from "react";
// import { Form, Button } from "react-bootstrap";
// import { Trash } from "react-bootstrap-icons";
// import axios from "../services/axios";

// const WorkEntryRow = ({
//   id,
//   hours,
//   workType,
//   onHoursChange,
//   onWorkTypeChange,
//   onRemove,
// }) => {
//   // Функция для удаления записи
//   const handleRemoveClick = async () => {
//     onRemove(id);
//     if (`${id}`.startsWith("temp-")) return;
//     try {
//       // Отправка запроса на удаление записи
//       await axios.delete(`/workTimeLogs/${id}`);
//       console.log(`Запись с id=${id} успешно удалена`);
//     } catch (error) {
//       console.error("Ошибка при удалении записи:", error);
//     }
//   };

//   return (
//     <div className="d-flex mb-2 align-items-start">
//       <Form.Control
//         className="me-2"
//         type="number"
//         placeholder="Часы"
//         value={hours}
//         style={{ width: "100px" }}
//         onChange={(e) => onHoursChange(id, e.target.value)}
//       />
//       <Form.Control
//         as="textarea"
//         className="me-2 flex-grow-1"
//         placeholder="Вид работы"
//         value={workType}
//         style={{ minHeight: "38px", height: "38px" }}
//         onChange={(e) => onWorkTypeChange(id, e.target.value)}
//       />
//       <Button
//         variant="danger"
//         className="btn-sm"
//         onClick={handleRemoveClick}
//         style={{ width: "45px", height: "38px" }}
//       >
//         <Trash />
//       </Button>
//     </div>
//   );
// };

// export default WorkEntryRow;
