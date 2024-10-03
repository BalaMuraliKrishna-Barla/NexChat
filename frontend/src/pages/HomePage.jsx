import React, { useState } from 'react';
import { Col, Container, Row, Tabs, TabPane } from 'react-bootstrap';
import Signup from '../components/Signup';
import Login from '../components/Login';


const HomePage = () => {
  const [key, setKey] = useState('login');

  return (
    <Container className="border border-dark">
      <Row className="justify-content-center mt-5 border border-danger">
        <Col md={6} className="border border-primary">
          <h1 className="text-center mb-4">NexChat</h1>
          <Tabs
            id="controlled-tab"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <TabPane
              eventKey="login"
              title="Login"
              style={{ flexGrow: 1, textAlign: 'center' }}
            >
              <Login />
            </TabPane>
            <TabPane
              eventKey="signup"
              title="Signup"
              style={{ flexGrow: 1, textAlign: 'center' }}
            >
              <Signup />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;