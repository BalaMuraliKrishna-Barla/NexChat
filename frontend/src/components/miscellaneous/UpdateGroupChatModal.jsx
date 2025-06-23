// frontend/src/components/miscellaneous/UpdateGroupChatModal.jsx

import React, { useState } from 'react';
import { Modal, Button, Form, Badge, Spinner } from 'react-bootstrap';
import { ChatState } from '../../Context/ChatProvider';
import { toast } from 'react-toastify';
import { searchUsers, renameGroup, addUserToGroup, removeUserFromGroup } from '../../services/api';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, children }) => {
  const [show, setShow] = useState(false);
  const [groupChatName, setGroupChatName] = useState('');
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();
  const isAdmin = user?._id === selectedChat?.groupAdmin?._id;

  const handleRename = async () => {
    if (!groupChatName) return;
    setRenameLoading(true);
    try {
      const { data } = await renameGroup(selectedChat._id, groupChatName, user.token);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      toast.success("Group name updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not rename group");
    }
    setRenameLoading(false);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;
    setLoading(true);
    try {
      const { data } = await searchUsers(query, user.token);
      setSearchResult(data);
    } catch (error) {
      toast.error('Failed to load search results');
    }
    setLoading(false);
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast.error("User is already in the group");
      return;
    }
    setLoading(true);
    try {
      const { data } = await addUserToGroup(selectedChat._id, userToAdd._id, user.token);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not add user");
    }
    setLoading(false);
  };

  const handleRemoveUser = async (userToRemove) => {
    setLoading(true);
    try {
      const { data } = await removeUserFromGroup(selectedChat._id, userToRemove._id, user.token);
      userToRemove._id === user._id ? setSelectedChat(null) : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      // fetchMessages(); // You might want to re-fetch messages or handle this differently
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not remove user");
    }
    setLoading(false);
  };

  return (
    <>
      <span onClick={() => setShow(true)}>{children}</span>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedChat?.chatName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>Members</h6>
          <div className="d-flex flex-wrap mb-3">
            {selectedChat?.users.map(u => (
              <Badge key={u._id} pill bg="success" className="m-1 d-flex align-items-center">
                {u.name}
                {isAdmin && u._id !== user._id && (
                  <span onClick={() => handleRemoveUser(u)} style={{cursor: 'pointer', marginLeft: '5px'}}>×</span>
                )}
              </Badge>
            ))}
          </div>
          <Form.Group className="mb-3 d-flex">
            <Form.Control
              placeholder="Chat Name"
              defaultValue={selectedChat?.chatName}
              onChange={(e) => setGroupChatName(e.target.value)}
              disabled={!isAdmin}
            />
            <Button variant="success" onClick={handleRename} disabled={!isAdmin} className="ms-2">
              {renameLoading ? <Spinner size="sm" /> : 'Update'}
            </Button>
          </Form.Group>
          {isAdmin && (
            <Form.Group>
              <Form.Control
                placeholder="Add User to group"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Form.Group>
          )}
          {loading ? <Spinner size="sm" /> : (
            searchResult?.slice(0, 3).map(u => (
              <div key={u._id} onClick={() => handleAddUser(u)} className="p-2 my-1 bg-light rounded" style={{cursor: 'pointer'}}>
                {u.name} ({u.email})
              </div>
            ))
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleRemoveUser(user)}>
            Leave Group
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;