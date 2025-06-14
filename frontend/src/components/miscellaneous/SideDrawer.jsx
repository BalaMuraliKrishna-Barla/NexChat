import React, { useState } from 'react';
import { Button, Form, Spinner, ListGroup } from 'react-bootstrap';
import { CiSearch } from 'react-icons/ci';
import { toast } from 'react-toastify';
import { ChatState } from '../../Context/ChatProvider';
import { searchUsers, accessChat } from '../../services/api';

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user, setSelectedChat, chats, setChats } = ChatState();

  const handleSearch = async () => {
    if (!search) {
      toast.warn('Please enter something to search');
      return;
    }
    setLoading(true);
    try {
      const { data } = await searchUsers(search, user.token);
      setSearchResult(data);
    } catch (error) {
      toast.error('Failed to load search results');
    } finally {
      setLoading(false);
    }
  };

  const handleAccessChat = async (userId) => {
    setLoadingChat(true);
    try {
      const { data } = await accessChat(userId, user.token);
      
      // Add chat to the list if it doesn't already exist
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      // Close the offcanvas drawer by simulating a click on the close button
      document.querySelector('#offcanvasRight .btn-close').click();
    } catch (error) {
      toast.error('Error fetching the chat');
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <>
      <Button
        variant="light"
        className="d-flex align-items-center"
        data-bs-toggle="offcanvas"
        data-bs-target="#searchUserOffcanvas"
      >
        <CiSearch />
        <span className="d-none d-md-inline mx-2">Search User</span>
      </Button>

      <div className="offcanvas offcanvas-start" tabIndex="-1" id="searchUserOffcanvas">
        {/* ... The entire offcanvas JSX remains the same ... */}
        {/* Make sure the id here matches the data-bs-target above */}
      </div>
    </>
  );
};

export default SideDrawer;