// frontend/src/pages/ChatsPage.jsx

import React, { useState, useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import MyChats from "../components/miscellaneous/MyChats";
import ChatBox from "../components/miscellaneous/ChatBox";
import Header from "../components/Chats/Header";
import { Container, Row, Col } from 'react-bootstrap';
import io from 'socket.io-client';

const ENDPOINT = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:5000';
let socket;

const ChatsPage = () => {
  const { user, selectedChat, setOnlineUsers, setTypingStatus } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    
    socket.on("connected", () => console.log("Socket connected on ChatsPage"));
    socket.on("online users", (users) => setOnlineUsers(users));
    
    // NEW: Global listeners for typing indicators
    socket.on('typing', (chatId) => {
        setTypingStatus(prev => ({ ...prev, [chatId]: true }));
    });
    socket.on('stop typing', (chatId) => {
        setTypingStatus(prev => ({ ...prev, [chatId]: false }));
    });

    return () => socket.disconnect();
  }, [user, setOnlineUsers, setTypingStatus]);

  return (
    <div style={{ width: "100%", backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      {user && <Header />}
      <Container fluid className="p-3">
        <Row style={{ paddingTop: '75px', height: 'calc(100vh - 75px)' }}>
          {/* FIX: Correctly checks `selectedChat` instead of `user.selectedChat` */}
          <Col md={4} lg={3} className={`${selectedChat ? 'd-none' : 'd-flex'} d-md-flex flex-column h-100`}>
            {user && <MyChats fetchAgain={fetchAgain} />}
          </Col>
          <Col md={8} lg={9} className={`${selectedChat ? 'd-flex' : 'd-none'} d-md-flex flex-column h-100`}>
            {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} socket={socket} />}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ChatsPage;