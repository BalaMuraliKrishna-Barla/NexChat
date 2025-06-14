// frontend/src/components/miscellaneous/ChatBox.jsx

import React, { useEffect, useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { Spinner, Form, InputGroup, Button } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchMessages, sendMessage } from '../../services/api';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
import './../../styles/ChatBox.css';

const ENDPOINT = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:5000';
var socket, selectedChatCompare;

const getSenderFull = (loggedUser, users) => {
  if (!loggedUser || !users || users.length < 2) return null;
  return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChat) return;
      setLoading(true);
      try {
        const { data } = await fetchMessages(selectedChat._id, user.token);
        setMessages(data);
        socket.emit("join chat", selectedChat._id);
      } catch (error) {
        toast.error("Failed to Load Messages");
      }
      setLoading(false);
    };
    loadMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  
  useEffect(() => {
    const messageListener = (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        // Handle notifications for other chats
      } else {
        setMessages((prev) => [...prev, newMessageReceived]);
      }
      setFetchAgain(!fetchAgain);
    };
    socket.on("message recieved", messageListener);
    return () => socket.off("message recieved", messageListener);
  }, [fetchAgain]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const tempMessage = newMessage;
        setNewMessage("");
        const { data } = await sendMessage({ content: tempMessage, chatId: selectedChat._id }, user.token);
        socket.emit("new message", data);
        setMessages([...messages, data]);
        setFetchAgain(!fetchAgain);
      } catch (error) {
        toast.error("Failed to send message");
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  
  const sender = getSenderFull(user, selectedChat?.users);

  return (
    <div className="d-flex flex-column p-3 bg-white w-100" style={{ borderRadius: '10px', height: '100%' }}>
      {selectedChat ? (
        <>
          <h4 className="mb-3 pb-2 d-flex align-items-center border-bottom">
            <Button variant="light" className="d-md-none me-2 p-1" onClick={() => setSelectedChat(null)}>
              <ArrowLeft size={20} />
            </Button>
            {sender && <img src={sender.pic} alt={sender.name} className="rounded-circle me-3" style={{width: 40, height: 40, objectFit: 'cover'}}/>}
            {selectedChat.isGroupChat ? selectedChat.chatName : sender?.name}
          </h4>
          <div className="chat-box d-flex flex-column justify-content-end w-100 h-100 p-3 rounded">
            {loading ? (
              <Spinner animation="border" className="align-self-center m-auto" />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
                {isTyping ? <div className="text-muted small ms-4">typing...</div> : <></>}
              </div>
            )}
            <Form onSubmit={handleSendMessage} className="mt-3">
              <InputGroup>
                <Form.Control
                  placeholder="Enter a message..."
                  value={newMessage}
                  onChange={typingHandler}
                  autoComplete="off"
                />
                <Button type="submit" variant="primary">Send</Button>
              </InputGroup>
            </Form>
          </div>
        </>
      ) : (
        <div className="d-flex align-items-center justify-content-center h-100">
          <h3 className="text-muted">Select a chat to start messaging</h3>
        </div>
      )}
    </div>
  );
};

export default ChatBox;