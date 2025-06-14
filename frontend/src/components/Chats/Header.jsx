import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import { Bell, Moon, Sun, User as UserIcon } from "lucide-react";
import SideDrawer from "../miscellaneous/SideDrawer"; // Import SideDrawer

const Header = () => {
  const navigate = useNavigate();
  const { user } = ChatState();
  
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <>
      <nav
        className="navbar d-flex justify-content-between align-items-center px-3 bg-light border-bottom"
        style={{ zIndex: 10, position: 'fixed', width: '100%', top: 0 }}
      >
        {/* Left Section: Search Button that triggers SideDrawer */}
        <SideDrawer /> 
        
        {/* Brand Name */}
        <a className="navbar-brand text-primary fs-4 fw-bold" href="/chats">
          NexChat
        </a>

        {/* Right Section */}
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-light">
            <Bell size={20} />
          </button>
          <div className="dropdown">
            <button
              className="btn dropdown-toggle p-0"
              id="profileDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {user ? (
                <img
                  src={user.pic}
                  alt={user.name}
                  className="rounded-circle"
                  style={{ height: "40px", width: "40px", objectFit: "cover" }}
                />
              ) : (
                <UserIcon size={24} />
              )}
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><a className="dropdown-item" href="#">Profile</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;