// frontend/src/components/miscellaneous/UpdateGroupChatModal.jsx

import React, { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { toast } from 'react-toastify';
import { searchUsers, renameGroup, addUserToGroup, removeUserFromGroup } from '../../services/api';
import ReusableModal from './ReusableModal';
import { X, LoaderCircle } from 'lucide-react';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();
  const isAdmin = user?._id === selectedChat?.groupAdmin?._id;

  const handleRename = async () => {
    if (!groupChatName || groupChatName === selectedChat.chatName) return;
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
    if (selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id) {
      toast.error("Only admins can remove someone!");
      return;
    }
    setLoading(true);
    try {
      const { data } = await removeUserFromGroup(selectedChat._id, userToRemove._id, user.token);
      userToRemove._id === user._id ? setSelectedChat(null) : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      if(userToRemove._id === user._id) setIsOpen(false); // Close modal if user leaves
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not remove user");
    }
    setLoading(false);
  };
  
  const handleClose = () => {
    setIsOpen(false);
    setSearchResult([]);
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>
      <ReusableModal
        isOpen={isOpen}
        onClose={handleClose}
        title={selectedChat?.chatName}
        footer={
          <button onClick={() => handleRemoveUser(user)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Leave Group
          </button>
        }
      >
        <div className="space-y-4">
          <div>
            <h6 className="font-semibold mb-2">Members</h6>
            <div className="flex flex-wrap gap-2">
              {selectedChat?.users.map(u => (
                <div key={u._id} className="flex items-center bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  <span>{u.name}</span>
                  {isAdmin && u._id !== user._id && (
                    <button onClick={() => handleRemoveUser(u)} className="ml-1.5 text-green-200 hover:text-white"><X size={14} /></button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <input
              placeholder="Chat Name"
              defaultValue={selectedChat?.chatName}
              onChange={(e) => setGroupChatName(e.target.value)}
              disabled={!isAdmin}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <button onClick={handleRename} disabled={!isAdmin || renameLoading} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400">
              {renameLoading ? <LoaderCircle className="animate-spin" size={18}/> : 'Update'}
            </button>
          </div>
          
          {isAdmin && (
            <div>
              <input
                placeholder="Add user to group"
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="h-24 overflow-y-auto border rounded-md">
            {loading ? (
              <div className="flex justify-center items-center h-full"><LoaderCircle className="w-6 h-6 text-blue-600 animate-spin" /></div>
            ) : (
              searchResult?.slice(0, 3).map(u => (
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

export default UpdateGroupChatModal;