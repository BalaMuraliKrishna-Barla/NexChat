import React, { useState } from 'react';
import { Modal, Button, Form, Badge } from 'react-bootstrap';
import { ChatState } from '../../Context/ChatProvider';
import { toast } from 'react-toastify';
import { searchUsers, createGroupChat } from '../../services/api';

const GroupChatModal = ({ children }) => {
  const [show, setShow] = useState(false);
  const [groupChatName, setGroupChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;
    try {
      setLoading(true);
      const { data } = await searchUsers(query, user.token);
      setSearchResult(data);
    } catch (error) {
      toast.error('Failed to load search results');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = (userToAdd) => {
    if (selectedUsers.some(u => u._id === userToAdd._id)) {
      toast.warn('User already added');
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleRemoveUser = (userToRemove) => {
    setSelectedUsers(selectedUsers.filter(u => u._id !== userToRemove._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length < 2) {
      toast.warn('Please fill all fields and add at least 2 users');
      return;
    }
    try {
      const userIds = selectedUsers.map(u => u._id);
      const { data } = await createGroupChat({ name: groupChatName, users: userIds }, user.token);
      setChats([data, ...chats]);
      setShow(false);
      toast.success('New group chat created!');
    } catch (error) {
      toast.error('Failed to create group chat');
    }
  };

  return (
    <>
      <span onClick={() => setShow(true)}>{children}</span>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Group Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control
              type="text"
              placeholder="Chat Name"
              className="mb-3"
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <Form.Control
              type="text"
              placeholder="Add Users eg: John, Pavan"
              className="mb-1"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Form>
          <div className="d-flex flex-wrap">
            {selectedUsers.map(u => (
              <Badge key={u._id} pill bg="primary" className="m-1 d-flex align-items-center">
                {u.name}
                <span onClick={() => handleRemoveUser(u)} style={{cursor: 'pointer', marginLeft: '5px'}}>x</span>
              </Badge>
            ))}
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            searchResult?.slice(0, 4).map(u => (
              <div key={u._id} onClick={() => handleAddUser(u)} className="p-2 my-1 bg-light rounded" style={{cursor: 'pointer'}}>
                {u.name}
              </div>
            ))
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmit}>
            Create Chat
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default GroupChatModal;