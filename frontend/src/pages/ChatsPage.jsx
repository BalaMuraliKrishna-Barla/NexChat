import React from 'react'
import {useNavigate } from 'react-router-dom';
import { images } from '../assets/assets';
import { ChatState } from '../Context/ChatProvider';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from '../components/miscellaneous/MyChats';
import ChatBox from '../components/miscellaneous/ChatBox';
import "./../styles/ChatsPage.css";
const ChatsPage = () => {
  const navigate = useNavigate();
  const Logout = () => {
    localStorage.removeItem('userInfo');
    navigate("/");
  }

  const { user } = ChatState();
  return (
  <div
    className="position-relative blur-top"
    style={{
      backgroundImage: `url(${images.chatspage_bg_image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100vh",
      width: "100%",
    }}
  >
    <div
  className="d-flex justify-content-between p-3 bg-opacity-50"
  style={{
    position: "relative",
    zIndex: 2,
    backdropFilter: "blur(20px)", // Apply strong blur effect directly
    WebkitBackdropFilter: "blur(20px)", // Safari support
    background: "rgba(255, 255, 255, 0.1)", // Lighter background
  }}
>
  <h2 className='text-white'>NexChat</h2>
  <h2 className="text-white">Chat Page</h2>
  <SideDrawer />
</div>


    <MyChats />
    <ChatBox />

    <button className="btn btn-danger" onClick={Logout}>
      Logout
    </button>
  </div>
);

}

export default ChatsPage
