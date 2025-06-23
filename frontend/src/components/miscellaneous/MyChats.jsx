// frontend/src/components/miscellaneous/MyChats.jsx

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ChatState } from '../../Context/ChatProvider';
import { fetchChats } from '../../services/api';
import { Button, ListGroup, Spinner, Badge } from 'react-bootstrap';
import GroupChatModal from './GroupChatModal';

const getSender = (loggedUser, users) => {
  if (!loggedUser || !users || users.length < 2) return { name: "Unknown User", pic: "" };
  return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};

const MyChats = ({ fetchAgain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats, onlineUsers, typingStatus, notifications, setNotifications } = ChatState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadChats = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data } = await fetchChats(user.token);
        setChats(data);
      } catch (error) { toast.error("Failed to load chats."); }
      finally { setLoading(false); }
    };
    loadChats();
  }, [user, fetchAgain, setChats]);

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    // When a chat is clicked, clear all notifications for that specific chat.
    setNotifications(notifications.filter(n => n.chat._id !== chat._id));
  };

  return (
    <div className="d-flex flex-column h-100 p-3 bg-white" style={{ borderRadius: '10px' }}>
      <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
        <h4 className="m-0">My Chats</h4>
        <GroupChatModal><Button variant="light">+ New Group</Button></GroupChatModal>
      </div>
      <div className="flex-grow-1" style={{ overflowY: 'auto' }}>
        {loading ? (
          <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>
        ) : chats.length > 0 ? (
          <ListGroup variant="flush">
            {chats.map((chat) => {
              const sender = getSender(user, chat.users);
              const isOnline = !chat.isGroupChat && onlineUsers.includes(sender?._id);
              const isTyping = typingStatus[chat._id];
              // Count how many notifications exist for this chat.
              const notificationCount = notifications.filter(n => n.chat._id === chat._id).length;

              return (
                <ListGroup.Item
                  key={chat._id}
                  action
                  onClick={() => handleChatClick(chat)}
                  active={selectedChat?._id === chat._id}
                  className="d-flex justify-content-between align-items-center p-2 rounded mb-1"
                >
                  <div className="d-flex align-items-center" style={{ overflow: 'hidden' }}>
                    <div style={{ position: 'relative' }}>
                      <img src={!chat.isGroupChat ? sender.pic : 'https://i.pravatar.cc/150?u=group'} alt="avatar" className="rounded-circle me-3" style={{ width: '45px', height: '45px', objectFit: 'cover' }} />
                      {isOnline && <span className="online-indicator"></span>}
                    </div>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <strong>{!chat.isGroupChat ? sender.name : chat.chatName}</strong>
                      
                      {isTyping ? (
                        <div className="text-success small fst-italic">typing...</div>
                      ) : chat.latestMessage ? (
                        <div className={`text-muted small ${notificationCount > 0 ? 'fw-bold text-success' : ''}`}>
                          {notificationCount === 0 && <strong>{chat.latestMessage.sender.name}: </strong>}
                          {chat.latestMessage.content.length > 25 ? chat.latestMessage.content.substring(0, 25) + "..." : chat.latestMessage.content}
                        </div>
                      ) : (
                        <div className="text-muted small">No messages yet.</div>
                      )}
                    </div>
                  </div>

                  {/* The Notification Badge */}
                  {notificationCount > 0 && (
                    <Badge bg="success" pill>{notificationCount}</Badge>
                  )}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        ) : (
          <div className="text-center text-muted mt-5"><p>No chats found.</p><p>Click the search icon to start a new conversation.</p></div>
        )}
      </div>
    </div>
  );
};

export default MyChats;