import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <div style={{ height: '20px', backgroundColor: '#f8f9fa' }}>
      <Container className="text-center" style={{ lineHeight: '20px', fontSize: '12px' }}>
       ООО "Модус" 2024  Версия 1.0.0
      </Container>
    </div>
  );
};

export default Footer;
