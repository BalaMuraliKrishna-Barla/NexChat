// frontend/src/components/miscellaneous/GroupChatModal.jsx

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { ChatState } from '../../Context/ChatProvider';
import { searchUsers, createGroupChat } from '../../services/api';
import ReusableModal from './ReusableModal';
import { X, LoaderCircle } from 'lucide-react';

const GroupChatModal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;
    setLoading(true);
    try {
      const { data } = await searchUsers(query, user.token);
      setSearchResult(data);
    } catch (error) { toast.error('Failed to load search results'); } 
    finally { setLoading(false); }
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
      toast.warn('Please provide a group name and add at least 2 users.');
      return;
    }
    setSubmitLoading(true);
    try {
      const userIds = selectedUsers.map(u => u._id);
      const { data } = await createGroupChat({ name: groupChatName, users: userIds }, user.token);
      setChats([data, ...chats]);
      handleClose(); // Close and reset state
      toast.success('New group chat created!');
    } catch (error) {
      toast.error('Failed to create group chat');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  const handleClose = () => {
    setIsOpen(false);
    setGroupChatName('');
    setSelectedUsers([]);
    setSearch('');
    setSearchResult([]);
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>
      
      <ReusableModal
        isOpen={isOpen}
        onClose={handleClose}
        title="Create a New Group"
        footer={
          <button onClick={handleSubmit} disabled={submitLoading} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400">
            {submitLoading ? 'Creating...' : 'Create Chat'}
          </button>
        }
      >
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Group Chat Name" 
            onChange={(e) => setGroupChatName(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="text" 
            placeholder="Add users e.g. John, Pavan" 
            onChange={(e) => handleSearch(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            {selectedUsers.map(u => (
              <div key={u._id} className="flex items-center bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                <span>{u.name}</span>
                <button onClick={() => handleRemoveUser(u)} className="ml-1.5 text-blue-200 hover:text-white focus:outline-none"><X size={14}/></button>
              </div>
            ))}
          </div>

          <div className="h-40 overflow-y-auto border rounded-md">
            {loading ? (
              <div className="flex justify-center items-center h-full"><LoaderCircle className="w-6 h-6 text-blue-600 animate-spin" /></div>
            ) : (
              searchResult?.slice(0, 4).map(u => (
                <div key={u._id} onClick={() => handleAddUser(u)} className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                  <img src={u.pic} alt={u.name} className="w-8 h-8 rounded-full mr-3" />
                  <div>
                    <p className="font-semibold">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </ReusableModal>
    </>
  );
};

export default GroupChatModal;