import React, { useState, useEffect } from "react";
import { Modal, Button, Form, ListGroup } from "react-bootstrap";
import axios from "../services/axios";
import { Document, Page, pdfjs } from "react-pdf";
import { X } from "react-bootstrap-icons";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "./AttachDocumentModal.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const AttachDocumentModal = ({ show, onHide, milestone, fetchMilestones }) => {
  const [files, setFiles] = useState([]);
  const [fileUrls, setFileUrls] = useState([]);

  useEffect(() => {
    if (show && milestone?.documentUrls) {
      let documentUrls = [];
      if (typeof milestone.documentUrls === "string") {
        try {
          documentUrls = JSON.parse(milestone.documentUrls);
        } catch (e) {
          console.error("Error parsing documentUrls:", e);
        }
      } else if (Array.isArray(milestone.documentUrls)) {
        documentUrls = milestone.documentUrls;
      }
      const fullUrls = documentUrls.map((doc) => ({
        name: doc.name,
        url: `${import.meta.env.VITE_API_BASE_URL}/${doc.url.replace(
          /\\/g,
          "/"
        )}`,
      }));
      setFileUrls(fullUrls);
      setFiles([]);
    } else {
      setFileUrls([]);
    }
  }, [show, milestone]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    previewFiles(newFiles);
  };

  const previewFiles = (files) => {
    const newFileUrls = files.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve({ name: file.name, url: reader.result });
        };
      });
    });

    Promise.all(newFileUrls).then((urls) => {
      setFileUrls((prevUrls) => [...prevUrls, ...urls]);
    });
  };

  const handleRemoveFile = async (index) => {
    const fileUrl = fileUrls[index].url;
    const fileName = fileUrls[index].name;

    try {
      await axios.post(`/milestones/${milestone.id}/remove-document`, {
        fileName,
      });
      setFileUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
      fetchMilestones();
    } catch (error) {
      console.error("Error removing document:", error);
    }
  };

  const handleSubmit = async () => {
    if (files.length > 0) {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("documents", file);
      });

      const existingDocuments = fileUrls
        .filter((url) =>
          url.url.includes(`${import.meta.env.VITE_API_BASE_URL}`)
        )
        .map((url) => ({
          name: url.name,
          url: url.url.split(`${import.meta.env.VITE_API_BASE_URL}/`)[1],
        }));

      formData.append("existingDocuments", JSON.stringify(existingDocuments));

      try {
        await axios.post(
          `/milestones/${milestone.id}/attach-documents`,
          formData
        );
        fetchMilestones();
      } catch (error) {
        console.error("Error uploading documents:", error);
      }
    }
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Документы</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Выберите PDF файлы</Form.Label>
            <Form.Control
              type="file"
              accept="application/pdf"
              multiple
              onChange={handleFileChange}
            />
          </Form.Group>
        </Form>
        <div className="pdf-scroll-container">
          {fileUrls.map((file, index) => (
            <div className="pdf-thumbnail" key={index}>
              <a href={file.url} target="_blank" rel="noopener noreferrer">
                <Document file={file.url} onLoadSuccess={({ numPages }) => {}}>
                  <Page pageNumber={1} width={150} />
                </Document>
              </a>
              <div className="pdf-name">{file.name}</div>
              <Button
                variant="danger"
                className="remove-btn"
                onClick={() => handleRemoveFile(index)}
              >
                <X />
              </Button>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Сохранить изменения
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AttachDocumentModal;
