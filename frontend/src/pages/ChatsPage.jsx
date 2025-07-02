// frontend/src/pages/ChatsPage.jsx

import React, { useState, useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import MyChats from "../components/miscellaneous/MyChats";
import ChatBox from "../components/miscellaneous/ChatBox";
import Header from "../components/Chats/Header";
import io from 'socket.io-client';

const ENDPOINT = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:5000';
let socket;

const ChatsPage = () => {
  const { user, selectedChat, setOnlineUsers, setTypingStatus, notifications, setNotifications } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  // This useEffect now has a STABLE dependency array.
  useEffect(() => {
    if (!user) return;
    
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    
    socket.on("connected", () => console.log("Socket connected on ChatsPage"));
    socket.on("online users", (users) => setOnlineUsers(users));
    
    // These listeners are set up once and will update state correctly.
    socket.on('typing', (chatId) => setTypingStatus(prev => ({ ...prev, [chatId]: true })));
    socket.on('stop typing', (chatId) => setTypingStatus(prev => ({ ...prev, [chatId]: false })));
    
    return () => {
        socket.disconnect();
    };
    // FIX: The dependency array now only contains stable functions from the context provider.
    // It will not run again when `selectedChat` or `notifications` change.
  }, [user, setOnlineUsers, setTypingStatus]);
  
  // This separate useEffect handles ONLY the message listener.
  useEffect(() => {
      if(!socket) return;
      
      const messageListener = (newMessageReceived) => {
          if (!selectedChat || selectedChat._id !== newMessageReceived.chat._id) {
            if (!notifications.some(n => n._id === newMessageReceived._id)) {
                setNotifications([newMessageReceived, ...notifications]);
            }
          }
          setFetchAgain(prev => !prev);
      };
      
      socket.on("message recieved", messageListener);
      
      return () => {
          socket.off("message recieved", messageListener);
      };
  }, [socket, selectedChat, notifications, setNotifications])

  return (
    <div className="w-full min-h-screen bg-gray-100">
      {user && <Header />}
      <main className="pt-[60px] h-screen">
        <div className="flex h-full p-2 sm:p-4 gap-2 sm:gap-4">
          <div className={`${selectedChat ? 'hidden' : 'flex'} md:flex flex-col w-full md:w-1/3 lg:w-1/4`}>
            {user && <MyChats fetchAgain={fetchAgain} />}
          </div>
          <div className={`${selectedChat ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-2/3 lg:w-3/4`}>
            {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} socket={socket} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatsPage;