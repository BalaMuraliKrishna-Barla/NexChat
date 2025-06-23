// frontend/src/Context/ChatProvider.js
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState(); // The chat currently open in ChatBox
  const [chats, setChats] = useState([]); // The user's list of all chats
  const [onlineUsers, setOnlineUsers] = useState([]); // The list of online users
  const [typingStatus, setTypingStatus] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        onlineUsers,
        setOnlineUsers,
        typingStatus,
        setTypingStatus,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => useContext(ChatContext);

export default ChatProvider;
