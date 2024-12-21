import React, { useState, useEffect } from 'react';
import { Container, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap';
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
      return () => clearTimeout(timeout); // Cleanup the timeout if component unmounts
    }
  }, [loggedOut, navigate]);

  const handleLogout = () => {
    setLoggedOut(true); 
    localStorage.removeItem("userInfo"); 
  };

  return (
      <div>
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto"> </Nav>
              <Nav className="ms-auto">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#link">Link</Nav.Link>
                <NavDropdown
                  title={
                    user ? (
                      <Image
                        src={user.pic}
                        alt={user.name}
                        style={{ height: "40px", width: "40px" }}
                        roundedCircle
                      />
                    ) : (
                      <span>Loading...</span> // Fallback if user info is not available
                    )
                  }
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item href="#action/3.1">Account Settings</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">Change Password</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    href="#logout"
                    onClick={handleLogout}
                    className="text-danger"
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    );
};

export default Header;
