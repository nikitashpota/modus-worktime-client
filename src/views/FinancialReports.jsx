import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import FinancialBuildingList from "../components/FinancialBuildingList";
import FinancialCharts from "../components/FinancialCharts";
import { useAuth } from "../services/AuthContext";

const FinancialReports = () => {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const { userRole } = useAuth();

  if (userRole !== "Администратор")
    return (
      <h5
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "95%",
          textAlign: "center",
        }}
      >
        У вас нет прав. Пожалуйста, обратитесь к администратору для установления
        ролей.
      </h5>
    );

  return (
    <Container fluid>
      <Row>
        <Col md={3}>
          <FinancialBuildingList onSelect={setSelectedBuilding} />
        </Col>
        <Col md={8}>
          {selectedBuilding ? (
            <FinancialCharts building={selectedBuilding} />
          ) : (
            <h5
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "calc(100vh - 230px)",
                textAlign: "center",
              }}
            >
              Выберите здание для отображения финансовых отчетов
            </h5>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default FinancialReports;
