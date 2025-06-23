// frontend/src/components/Chats/Header.jsx

import React from 'react';
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import SideDrawer from "../miscellaneous/SideDrawer";
import ProfileModal from "../miscellaneous/ProfileModal";
import { Dropdown } from 'react-bootstrap';

const Header = () => {
  const navigate = useNavigate();
  const { user } = ChatState();
  
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <nav className="navbar d-flex justify-content-between align-items-center px-3 bg-white border-bottom" style={{ zIndex: 10, position: 'fixed', width: '100%', top: 0, height: '60px' }}>
      <SideDrawer /> 
      
      <a className="navbar-brand text-primary fs-4 fw-bold" href="/chats">NexChat</a>
      
      <div className="d-flex align-items-center">
        {/* Profile Dropdown */}
        <Dropdown>
          <Dropdown.Toggle variant="light" className="p-0 border-0 bg-transparent">
            <img src={user?.pic} alt={user?.name} className="rounded-circle" style={{ height: "40px", width: "40px", objectFit: "cover" }} />
          </Dropdown.Toggle>
          
          <Dropdown.Menu align="end">
            <ProfileModal>
              <Dropdown.Item as="button">My Profile</Dropdown.Item>
            </ProfileModal>
            <Dropdown.Divider />
            <Dropdown.Item as="button" className="text-danger" onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </nav>
  );
};

export default Header;