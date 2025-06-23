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
  const { user, selectedChat, setSelectedChat, chats, setChats, onlineUsers, typingStatus } = ChatState();    
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const loadChats = async () => {
      if (!user) return;
      setLoading(true); 
      try {
        const { data } = await fetchChats(user.token);
        setChats(data);
      } catch (error) {
        toast.error("Failed to load chats.");
      } finally {
        setLoading(false); 
      }
    };

    loadChats();
  }, [user, fetchAgain, setChats]); // Re-fetches when fetchAgain changes

  return (
    // 1. Main Container: A white, rounded box that takes up the full height of its column.
    <div className="d-flex flex-column h-100 p-3 bg-white" style={{ borderRadius: '10px' }}>

        {/* 2. Header Section: Title and "New Group" button. */}
        <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <h4 className="m-0">My Chats</h4>
            <GroupChatModal>
                <Button variant="light">+ New Group</Button>
            </GroupChatModal>
        </div>

        {/* 3. Chat List Container: This part will scroll if the list is long. */}
        <div className="flex-grow-1" style={{ overflowY: 'auto' }}>
            {loading ? (
                // 4. Loading Spinner: Shows only when chats are being fetched.
                <div className="text-center mt-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : chats.length > 0 ? (
                // 5. The Actual List: Displayed when loading is false and there are chats.
                <ListGroup variant="flush">
                    {chats.map((chat) => {

                        const sender = getSender(user, chat.users);
                        const isOnline = !chat.isGroupChat && onlineUsers.includes(sender?._id);
                        const isTyping = typingStatus[chat._id];
                        return (
                            // 6. A Single Chat Item: This is one row in the list.
                            <ListGroup.Item
                                key={chat._id}
                                action
                                onClick={() => setSelectedChat(chat)}
                                active={selectedChat?._id === chat._id}
                                className="d-flex align-items-center p-2 rounded mb-1"
                            >
                                {/* 7. Avatar with Online Status Indicator */}
                                <div style={{ position: 'relative' }}>
                                    <img 
                                        src={!chat.isGroupChat ? sender.pic : 'https://i.pravatar.cc/150?u=group'} 
                                        alt="avatar" 
                                        className="rounded-circle me-3" 
                                        style={{ width: '45px', height: '45px', objectFit: 'cover' }} 
                                    />
                                    {/* This green dot only appears if the user is online. */}
                                    {isOnline && (
                                        <span className="online-indicator"></span>
                                    )}
                                </div>

                                {/* 8. Chat Name and Last Message */}
                                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    <strong>
                                        {!chat.isGroupChat ? sender.name : chat.chatName}
                                    </strong>
                                    {/* Show the latest message if it exists */}
                                    {isTyping ? 
                                    (
                                        <div className="text-success small fst-italic">typing...</div>
                                    ) : chat.latestMessage ? 
                                        (
                                            <div className="text-muted small">
                                                <strong>    {chat.latestMessage.sender.name}: </strong>
                                                {
                                                    chat.latestMessage.content.length > 30 
                                                    ? chat.latestMessage.content.substring(0, 30) + "..." 
                                                    : chat.latestMessage.content
                                                }
                                            </div>
                                        ) : ( <div className="text-muted small">No messages yet.</div>  )
                                    }
                                </div>
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
            ) : (
                // 9. "No Chats" Message: Shown if loading is false and the chats array is empty.
                <div className="text-center text-muted mt-5">
                    <p>No chats found.</p>
                    <p>Click the search icon to start a new conversation.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default MyChats;