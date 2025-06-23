// frontend/src/components/miscellaneous/SideDrawer.jsx

import React, { useState, useEffect } from 'react';
import { Button, Form, Spinner, ListGroup, Offcanvas } from 'react-bootstrap';
import { CiSearch } from 'react-icons/ci';
import { toast } from 'react-toastify';
import { ChatState } from '../../Context/ChatProvider';
import { searchUsers, accessChat } from '../../services/api';

const SideDrawer = () => {
  // 1. STATE MANAGEMENT
  const [show, setShow] = useState(false);            // Controls if the side menu is open or closed
  const [search, setSearch] = useState('');            // Holds the user's text from the search input
  const [searchResult, setSearchResult] = useState([]);  // Holds the list of users returned from the API
  const [loading, setLoading] = useState(false);         // Shows a spinner while searching for users
  const [loadingChat, setLoadingChat] = useState(false);   // Shows a spinner after clicking a user, while creating the chat

  const { user, setSelectedChat, chats, setChats } = ChatState();

  // Simple functions to control the menu visibility
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  // 2. LIVE SEARCH WITH DEBOUNCE
  // This hook runs every time the user types something in the search box
  useEffect(() => {
    // If the search box is empty, clear the results and do nothing
    if (!search.trim()) {
      setSearchResult([]);
      return;
    }

    const searchHandler = async () => {
      setLoading(true);
      try {
        const { data } = await searchUsers(search, user.token);
        setSearchResult(data);
      } catch (error) {
        toast.error('Failed to load search results');
      }
      setLoading(false);
    };
    
    // This is a "debounce" timer. It waits for 500ms after the user stops typing
    // before it calls the API. This prevents sending an API request on every single keystroke.
    const delayDebounceFn = setTimeout(() => {
      searchHandler();
    }, 500);

    // This cleanup function clears the timer if the user types again
    return () => clearTimeout(delayDebounceFn);
  }, [search, user.token]); // Dependency array: This code runs only when 'search' or 'user.token' changes

  // 3. STARTING A CHAT
  // This function is called when a user clicks on a search result
  const handleAccessChat = async (userId) => {
    setLoadingChat(true);
    try {
      const { data } = await accessChat(userId, user.token);
      
      // If the chat isn't already in our list of chats, add it
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      
      // Set this new chat as the currently selected one and close the menu
      setSelectedChat(data);
      handleClose();

    } catch (error) {
      toast.error('Error fetching the chat');
    }
    setLoadingChat(false);
  };

  return (
    <>
      {/* 4. THE TRIGGER BUTTON */}
      {/* This button lives in the Header and its only job is to open the side menu. */}
      <Button variant="light" className="d-flex align-items-center" onClick={handleShow}>
        <CiSearch />
        <span className="d-none d-md-inline mx-2">Search User</span>
      </Button>

      {/* 5. THE OFF-CANVAS COMPONENT (The Side Menu) */}
      {/* This is controlled by React state (`show` and `onHide`). */}
      <Offcanvas show={show} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Search Users</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Search Input Field */}
          <Form.Control
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-3"
          />

          {/* Conditional Rendering for Loading and Results */}
          {loading ? (
            <div className="text-center"><Spinner animation="border" /></div>
          ) : (
            <ListGroup variant="flush">
              {searchResult?.map((u) => (
                <ListGroup.Item 
                  key={u._id} 
                  action 
                  onClick={() => handleAccessChat(u._id)} 
                  className="d-flex align-items-center p-2 rounded"
                >
                  <img src={u.pic} alt={u.name} className="rounded-circle me-3" style={{width: 40, height: 40, objectFit: 'cover'}}/>
                  <div>
                    <strong>{u.name}</strong>
                    <div className="text-muted small">{u.email}</div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          {/* Spinner for when a chat is being created */}
          {loadingChat && <div className="text-center mt-3"><Spinner animation="border" /></div>}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default SideDrawer;