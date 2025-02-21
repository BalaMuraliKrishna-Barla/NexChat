import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import { Bell, Moon, Sun, User } from "lucide-react"; // New Modern Icons

const Header = () => {
  const navigate = useNavigate();
  const { user } = ChatState();
  const [loggedOut, setLoggedOut] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (loggedOut) {
      const timeout = setTimeout(() => {
        navigate("/");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [loggedOut, navigate]);

  const handleLogout = () => {
    setLoggedOut(true);
    localStorage.removeItem("userInfo");
  };

  return (
    <nav
      className="navbar position-fixed top-0 w-100  d-flex justify-content-between align-items-center px-4"
      style={{
        backdropFilter: "blur(15px)", // Glassmorphism effect
        WebkitBackdropFilter: "blur(15px)", // Safari support
        background: "rgba(255, 255, 255, 0.1)", // Light transparent effect
        padding: "10px 20px",
        zIndex: 10,
      }}
    >
      {/* Brand Name */}
      <a className="navbar-brand text-light fs-4 fw-bold" href="#home">
        NexChat
      </a>

      {/* Right Section */}
      <div className="d-flex align-items-center gap-3">
        {/* Theme Toggle */}
        <button
          className="btn"
          onClick={() => setDarkMode(!darkMode)}
          style={{ color: "white" }}
        >
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        {/* Notifications */}
        <button className="btn" style={{ color: "white" }}>
          <Bell size={24} />
        </button>

        {/* Profile */}
        <div className="dropdown">
          <button
            className="btn dropdown-toggle"
            id="profileDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ color: "white" }}
          >
            {user ? (
              <img
                src={user.pic}
                alt={user.name}
                className="rounded-circle"
                style={{ height: "40px", width: "40px", objectFit: "cover" }}
              />
            ) : (
              <User size={24} />
            )}
          </button>

          <ul className="dropdown-menu dropdown-menu-end">
            <button
              className="dropdown-item text-danger"
              onClick={handleLogout}
            >
              Logout
            </button>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
