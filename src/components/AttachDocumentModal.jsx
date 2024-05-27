import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "../services/axios";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const AttachDocumentModal = ({
  show,
  onHide,
  milestone,
  fetchMilestones,
}) => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    console.log("documentUrl", milestone?.documentUrl);
    if (show && milestone?.documentUrl) {
      const fullUrl = `${import.meta.env.VITE_API_BASE_URL}/${
        milestone.documentUrl
      }`;
      setFileUrl(fullUrl);
    } else {
      setFileUrl(null);
    }
  }, [show, milestone]);

  const handleFileChange = (event) => {
    const newFile = event.target.files[0];
    previewFile(newFile);
    setFile(newFile);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFileUrl(reader.result);
    };
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);

    try {
      await axios.post(`/milestones/${milestone.id}/attach-document`, formData);
      fetchMilestones();
      onHide(); // Close modal after successful submission
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Приложить акт</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f8f9fa",
            border: fileUrl ? "3px solid blue" : "3px solid red",
            minHeight: "200px", // Adjust height as needed
            marginBottom: "10px",
          }}
        >
          {fileUrl && (
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              <Document file={fileUrl} onLoadSuccess={({ numPages }) => {}}>
                <Page pageNumber={1} width={400} />
              </Document>
            </a>
          )}
        </div>
        <Form>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Выберите PDF файл</Form.Label>
            <Form.Control
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AttachDocumentModal;
