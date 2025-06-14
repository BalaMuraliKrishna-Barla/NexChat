// frontend/src/components/miscellaneous/MyChats.jsx

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ChatState } from '../../Context/ChatProvider';
import { fetchChats } from '../../services/api';
import { Button, ListGroup, Spinner } from 'react-bootstrap';
import GroupChatModal from './GroupChatModal';

const getSender = (loggedUser, users) => {
  if (!loggedUser || !users || users.length < 2) return { name: "Unknown User", pic: "" };
  return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};

const MyChats = ({ fetchAgain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  useEffect(() => {
    const loadChats = async () => {
      if (!user) return;
      try {
        const { data } = await fetchChats(user.token);
        setChats(data);
      } catch (error) {
        toast.error("Failed to load chats.");
      }
    };

    loadChats();
  }, [user, fetchAgain]); // Re-fetches when fetchAgain changes

  return (
    <div className="d-flex flex-column h-100 p-3 bg-white" style={{ borderRadius: '10px' }}>
      <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
        <h4 className="m-0">My Chats</h4>
        <GroupChatModal>
          <Button variant="light">+ New Group</Button>
        </GroupChatModal>
      </div>
      <div className="flex-grow-1" style={{ overflowY: 'auto' }}>
        {chats.length > 0 ? (
          <ListGroup variant="flush">
            {chats.map((chat) => {
              const sender = getSender(user, chat.users);
              return (
                <ListGroup.Item
                  key={chat._id}
                  action
                  onClick={() => setSelectedChat(chat)}
                  active={selectedChat?._id === chat._id}
                  className="d-flex align-items-center p-2 rounded mb-1"
                >
                  <img 
                    src={!chat.isGroupChat ? sender.pic : 'https://i.pravatar.cc/150?u=group'} 
                    alt="avatar" 
                    className="rounded-circle me-3" 
                    style={{ width: '45px', height: '45px', objectFit: 'cover' }} 
                  />
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <strong>
                      {!chat.isGroupChat ? sender.name : chat.chatName}
                    </strong>
                    {chat.latestMessage && (
                      <div className="text-muted small">
                        <strong>{chat.latestMessage.sender.name}: </strong>
                        {chat.latestMessage.content.length > 30 
                          ? chat.latestMessage.content.substring(0, 30) + "..." 
                          : chat.latestMessage.content}
                      </div>
                    )}
                  </div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        ) : (
          <div className="text-center text-muted mt-5">No chats yet.</div>
        )}
      </div>
    </div>
  );
};

export default MyChats;