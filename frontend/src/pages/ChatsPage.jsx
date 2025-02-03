import React from 'react'
import {useNavigate } from 'react-router-dom';
import { images } from '../assets/assets';

const ChatsPage = () => {
  const navigate = useNavigate();
  const Logout = () => {
    localStorage.removeItem('userInfo');
    navigate("/");
  }
  return (
    <div
      style={{
        backgroundImage: `url(${images.chatspage_bg_image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100%",
      }}
    >
      
      <h2 className='text-white'>Chat Page</h2>
      <button className="btn btn-danger" onClick={Logout}>
        Logout
      </button>
    </div>
  )
}

export default ChatsPage
