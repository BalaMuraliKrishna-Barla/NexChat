// frontend/src/components/Chats/Header.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import SideDrawer from "../miscellaneous/SideDrawer";
import ProfileModal from "../miscellaneous/ProfileModal";

const Header = () => {
  const navigate = useNavigate();
  const { user } = ChatState();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  // Close profile menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenuRef]);

  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4">
        <SideDrawer /> 
        
        <div className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate('/chats')}>
          NexChat
        </div>
        
        <div className="relative" ref={profileMenuRef}>
          <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="block focus:outline-none">
            <img src={user?.pic} alt={user?.name} className="w-10 h-10 rounded-full object-cover" />
          </button>
          
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30 border border-gray-100">
              <ProfileModal>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none">My Profile</button>
              </ProfileModal>
              <div className="border-t border-gray-100"></div>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 focus:outline-none">Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;