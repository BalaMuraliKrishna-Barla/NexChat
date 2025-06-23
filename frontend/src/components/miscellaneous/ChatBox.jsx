// frontend/src/components/miscellaneous/ChatBox.jsx

import React, { useEffect, useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { Spinner, Form, InputGroup, Button } from 'react-bootstrap';
import { ArrowLeft, Settings } from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchMessages, sendMessage } from '../../services/api';
import ScrollableChat from './ScrollableChat';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import './../../styles/ChatBox.css';

var selectedChatCompare;

const getSenderFull = (loggedUser, users) => {
  if (!loggedUser || !users || users.length < 2) return null;
  return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};

const ChatBox = ({ fetchAgain, setFetchAgain, socket }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  
  // This state is now only to track if the *current user* is in the middle of a typing session
  const [isCurrentlyTyping, setIsCurrentlyTyping] = useState(false);

  const { user, selectedChat, setSelectedChat, typingStatus } = ChatState();

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChat || !socket) return;
      setLoading(true);
      try {
        const { data } = await fetchMessages(selectedChat._id, user.token);
        setMessages(data);
        socket.emit("join chat", selectedChat._id);
      } catch (error) { toast.error("Failed to Load Messages"); }
      setLoading(false);
    };
    loadMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat, user.token, socket]);

  useEffect(() => {
    if (!socket) return;
    const messageListener = (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        // Handle notifications
      } else {
        setMessages((prev) => [...prev, newMessageReceived]);
      }
      setFetchAgain(!fetchAgain);
    };
    socket.on("message recieved", messageListener);
    return () => socket.off("message recieved", messageListener);
  }, [socket, fetchAgain, setFetchAgain]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
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

  // FIX: This is the new, robust way to handle the typing indicator
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socket) return;

    // If we haven't started typing yet, emit the event
    if (!isCurrentlyTyping) {
      setIsCurrentlyTyping(true);
      socket.emit("typing", selectedChat._id);
    }
  };
  
  // This useEffect hook now manages the "stop typing" debounce timer
  useEffect(() => {
    if (!socket) return;
    
    // If the input is empty or the chat changes, stop typing immediately
    if (!newMessage.trim()) {
        if (isCurrentlyTyping) {
            socket.emit("stop typing", selectedChat._id);
            setIsCurrentlyTyping(false);
        }
        return;
    }
    
    // Set a timer. If it completes, it means the user has stopped typing.
    const timer = setTimeout(() => {
      socket.emit("stop typing", selectedChat._id);
      setIsCurrentlyTyping(false);
    }, 2000); // 2 seconds after last keypress

    // Cleanup: If the user types again, clear the previous timer
    return () => clearTimeout(timer);
  }, [newMessage, selectedChat, socket, isCurrentlyTyping]);


  const sender = getSenderFull(user, selectedChat?.users);
  
  // Check the global typing status for this specific chat
  const otherUserIsTyping = typingStatus[selectedChat?._id];

  return (
    <div className="d-flex flex-column p-3 bg-white w-100" style={{ borderRadius: '10px', height: '100%' }}>
      {selectedChat ? (
        <>
          {/* Header remains the same... */}
          <div className="mb-3 pb-2 d-flex justify-content-between align-items-center border-bottom">
            <div className="d-flex align-items-center">
              <Button variant="light" className="d-md-none me-2 p-1" onClick={() => setSelectedChat(null)}><ArrowLeft size={20} /></Button>
              {!selectedChat.isGroupChat && sender && (<img src={sender.pic} alt={sender.name} className="rounded-circle me-3" style={{width: 40, height: 40, objectFit: 'cover'}}/>)}
              <h5 className="m-0">{selectedChat.isGroupChat ? selectedChat.chatName : sender?.name}</h5>
            </div>
            {selectedChat.isGroupChat && (<UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}><Button variant="light"><Settings size={20} /></Button></UpdateGroupChatModal>)}
          </div>
          
          <div className="chat-box d-flex flex-column justify-content-end w-100 h-100 p-3 rounded">
            {loading ? (
              <Spinner animation="border" variant="primary" className="align-self-center m-auto" />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
                {/* FIX: This now reads from the global state, not a local one */}
                {otherUserIsTyping && <div className="text-muted small ms-4">typing...</div>}
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
          <div className="text-center text-muted"><h3>Select a chat</h3><p>or search for a user to start messaging.</p></div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;