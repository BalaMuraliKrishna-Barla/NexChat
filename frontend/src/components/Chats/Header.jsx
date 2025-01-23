import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../../Context/ChatProvider';

const Header = () => {
  const navigate = useNavigate();
  const { user } = ChatState();
  const [loggedOut, setLoggedOut] = useState(false);

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
    <nav className="navbar navbar-light bg-light">
      <div className="container">
        {/* Brand Name */}
        <a className="navbar-brand" href="#home">NexChat</a>

        {/* Right Section */}
        <div className="d-flex align-items-center gap-3">
          {/* Dark/Light Toggle Icon */}
          <button className="btn btn-outline-secondary">
            <i className="fas fa-moon"></i> {/* Moon icon for dark mode */}
          </button>

          {/* Notifications Icon */}
          <button className="btn btn-outline-primary">
            <i className="fas fa-bell"></i> {/* Bell icon for notifications */}
          </button>

          {/* Profile Dropdown */}
          <div className="dropdown profile-dropdown">
            <a
              className="nav-link"
              href="#"
              id="profileDropdown"
              role="button"
            >
              {user ? (
                <img
                  src={user.pic}
                  alt={user.name}
                  className="profile-pic"
                  style={{ height: "40px", width: "40px", borderRadius: "50%" }}
                />
              ) : (
                <span>Loading...</span>
              )}
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
              <li>
                <a className="dropdown-item" href="#profile">Profile</a>
              </li>
              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
