// frontend/src/components/miscellaneous/MyChats.jsx

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ChatState } from '../../Context/ChatProvider';
import { fetchChats } from '../../services/api';
import GroupChatModal from './GroupChatModal';
import { LoaderCircle, Plus } from 'lucide-react';

const getSender = (loggedUser, users) => {
  if (!loggedUser || !users || users.length < 2) return { name: "Unknown User", pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" };
  return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};

const MyChats = ({ fetchAgain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats, notifications, setNotifications, onlineUsers } = ChatState();
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
    // FIX: Added `onlineUsers` to dependency array to force re-render when it changes.
  }, [user, fetchAgain, setChats, onlineUsers]);

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    setNotifications(notifications.filter(n => n.chat._id !== chat._id));
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">My Chats</h2>
        <GroupChatModal>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <Plus size={16} /> New Group
          </button>
        </GroupChatModal>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex justify-center items-center h-full"><LoaderCircle className="w-8 h-8 text-blue-600 animate-spin" /></div>
        ) : chats.length > 0 ? (
          <div className="flex flex-col space-y-1">
            {chats.map((chat) => {
              const isSelected = selectedChat?._id === chat._id;
              const sender = getSender(user, chat.users);
              const isOnline = !chat.isGroupChat && onlineUsers.includes(sender?._id);
              
              // Find the most recent notification for this chat, if any.
              const latestNotification = notifications.find(n => n.chat._id === chat._id);
              const notificationCount = notifications.filter(n => n.chat._id === chat._id).length;

              // Determine what text to show as the preview.
              let latestMessageText = "No messages yet.";
              if (latestNotification) {
                latestMessageText = latestNotification.content || "Sent a file";
              } else if (chat.latestMessage) {
                const prefix = chat.latestMessage.sender._id === user._id ? "You: " : "";
                latestMessageText = prefix + (chat.latestMessage.content || "Sent a file");
              }

              return (
                <button
                  key={chat._id}
                  onClick={() => handleChatClick(chat)}
                  className={`flex items-center w-full p-3 rounded-lg text-left transition-colors ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                >
                  <div className="relative flex-shrink-0">
                    <img src={!chat.isGroupChat ? sender.pic : 'https://i.pravatar.cc/150?u=group'} alt="avatar" className="w-12 h-12 rounded-full object-cover mr-4" />
                    {isOnline && <div className="absolute bottom-0 right-4 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{!chat.isGroupChat ? sender.name : chat.chatName}</p>
                    <p className={`text-sm truncate ${notificationCount > 0 ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                      {latestMessageText}
                    </p>
                  </div>
                  {notificationCount > 0 && <span className="ml-2 px-2 py-0.5 text-xs font-bold text-white bg-blue-600 rounded-full">{notificationCount}</span>}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-10 p-4">
            <p className="font-medium">No chats found.</p>
            <p className="text-sm">Click the search icon to start a new conversation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyChats;