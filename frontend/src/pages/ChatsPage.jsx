// frontend/src/pages/ChatsPage.jsx

import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import MyChats from "../components/miscellaneous/MyChats";
import ChatBox from "../components/miscellaneous/ChatBox";
import Header from "../components/Chats/Header";
import { Container, Row, Col } from 'react-bootstrap';

const ChatsPage = () => {
  const { user, selectedChat } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false); // State to trigger re-fetch

  return (
    <div style={{ width: "100%", backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      {user && <Header />}
      <Container fluid className="p-3">
        <Row style={{ paddingTop: '75px', height: 'calc(100vh - 75px)' }}>
          <Col md={4} lg={3} className={`${selectedChat ? 'd-none' : 'd-flex'} d-md-flex flex-column h-100`}>
            {user && <MyChats fetchAgain={fetchAgain} />}
          </Col>
          <Col md={8} lg={9} className={`${selectedChat ? 'd-flex' : 'd-none'} d-md-flex flex-column h-100`}>
            {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ChatsPage;