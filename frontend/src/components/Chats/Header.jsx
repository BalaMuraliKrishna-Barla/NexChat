// frontend/src/components/Chats/Header.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import SideDrawer from "../miscellaneous/SideDrawer";
import ProfileModal from "../miscellaneous/ProfileModal";
import ThemeToggle from '../miscellaneous/ThemeToggle'; // Import the new component

const Header = () => {
  const navigate = useNavigate();
  const { user } = ChatState();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  // Effect to close the profile dropdown when clicking outside of it
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
    <header className="fixed top-0 left-0 right-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between h-16 px-4">
        <SideDrawer /> 
        
        <div 
          className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer" 
          onClick={() => navigate('/chats')}
        >
          NexChat
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <div className="relative" ref={profileMenuRef}>
            <button 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} 
              className="block rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900"
            >
              <img src={user?.pic} alt={user?.name} className="w-10 h-10 rounded-full object-cover" />
            </button>
            
            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 z-30 border border-slate-200 dark:border-slate-700">
                <ProfileModal>
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none">
                    My Profile
                  </button>
                </ProfileModal>
                <div className="border-t border-slate-100 dark:border-slate-700"></div>
                <button 
                  onClick={handleLogout} 
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;