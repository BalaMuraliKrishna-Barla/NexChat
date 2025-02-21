import React from "react";
import { useNavigate } from "react-router-dom";
import { images } from "../assets/assets";
import { ChatState } from "../Context/ChatProvider";
import MyChats from "../components/miscellaneous/MyChats";
import ChatBox from "../components/miscellaneous/ChatBox";
import Header from "../components/Chats/Header";
import "./../styles/ChatsPage.css";

const ChatsPage = () => {
  const navigate = useNavigate();
  const { user } = ChatState();

  const Logout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <div
      className="position-relative"
      style={{
        backgroundImage: `url(${images.chatspage_bg_image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header Section */}
      <Header />

      {/* Main Chat Section */}
      <div
        className="d-flex"
        style={{
          height: "calc(100vh - 60px)", // Adjust height minus the header
          padding: "20px",
        }}
      >
        <MyChats />
        <ChatBox />
      </div>

      
    </div>
  );
};

export default ChatsPage;
