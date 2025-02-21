import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Tabs, TabPane } from 'react-bootstrap';
import Signup from '../components/Authentication/Signup';
import Login from '../components/Authentication/Login';
import { useNavigate } from 'react-router-dom';
import {images} from "./../assets/assets"

const HomePage = () => {

  const navigate = useNavigate();
  useEffect(() => {
    let user = localStorage.getItem("userInfo");
    if(user) navigate("/chats");

  }, [navigate])
  
  const [key, setKey] = useState('login');

  return (
    <div 
      style={{
      backgroundImage: `url(${images.chatspage_bg_image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100vh",
      width: "100%",
    }}
    >

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
    </div>
  );
};

export default HomePage;