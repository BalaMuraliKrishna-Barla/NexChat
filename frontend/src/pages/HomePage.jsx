// frontend/src/pages/HomePage.jsx

import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Tabs, Tab } from 'react-bootstrap';
import Signup from '../components/Authentication/Signup';
import Login from '../components/Authentication/Login';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("userInfo");
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <div 
      style={{
        backgroundColor: '#f0f2f5', // A simple, clean background color
        height: "100vh",
        width: "100%",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <div className="text-center mb-4">
              <h1 className="fw-bold text-primary">NexChat</h1>
              <p className="text-muted">Connect and chat in real-time.</p>
            </div>
            <div className="bg-white p-4 rounded shadow-sm">
              <Tabs defaultActiveKey="login" id="auth-tabs" fill className="mb-3">
                <Tab eventKey="login" title="Login">
                  <Login />
                </Tab>
                <Tab eventKey="signup" title="Signup">
                  <Signup />
                </Tab>
              </Tabs>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;