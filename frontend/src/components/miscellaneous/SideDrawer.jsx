// frontend/src/components/miscellaneous/SideDrawer.jsx

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { toast } from 'react-toastify';
import { ChatState } from '../../Context/ChatProvider';
import { searchUsers, accessChat } from '../../services/api';
import { Search, X, LoaderCircle } from 'lucide-react';

const DrawerContent = ({
  isOpen,
  handleClose,
  search,
  setSearch,
  loading,
  searchResult,
  loadingChat,
  handleAccessChat,
}) => (
  <>
    {/* Overlay */}
    <div
      onClick={handleClose}
      className="fixed inset-0 bg-black/60 z-40 animate-fade-in-fast"
    ></div>

    {/* Drawer Panel */}
    <div
      className={`fixed top-0 left-0 h-full bg-white dark:bg-slate-800 shadow-xl z-50 w-full max-w-sm p-4 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          Search Users
        </h3>
        <button
          onClick={handleClose}
          className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <X size={20} />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          autoFocus
        />
      </div>

      {/* Search Results */}
      <div className="mt-4 flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center p-10">
            <LoaderCircle className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : (
          searchResult?.map((u) => (
            <div
              key={u._id}
              onClick={() => handleAccessChat(u._id)}
              className="flex items-center p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
            >
              <img
                src={u.pic}
                alt={u.name}
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {u.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {u.email}
                </p>
              </div>
            </div>
          ))
        )}
        {loadingChat && (
          <div className="flex justify-center items-center p-4">
            <LoaderCircle className="w-6 h-6 text-indigo-600 animate-spin" />
          </div>
        )}
      </div>
    </div>
  </>
);

const SideDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user, setSelectedChat, chats, setChats } = ChatState();

  useEffect(() => {
    if (!search.trim()) {
      setSearchResult([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleSearch = async () => {
    if (!search.trim()) {
      // toast.warn('Please enter something to search'); // Optional: can be annoying
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
      
      const newChat = Array.isArray(data) ? data[0] : data;

      if (!chats.find((c) => c._id === newChat._id)) {
        setChats([newChat, ...chats]);
      }
      setSelectedChat(newChat);
      handleClose();
    } catch (error) {
      toast.error('Error fetching the chat');
    } finally {
      setLoadingChat(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearch('');
    setSearchResult([]);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none"
      >
        <Search size={20} />
      </button>

      {/* Drawer Portal */}
      {isOpen &&
        ReactDOM.createPortal(
          <DrawerContent
            isOpen={isOpen}
            handleClose={handleClose}
            search={search}
            setSearch={setSearch}
            loading={loading}
            searchResult={searchResult}
            loadingChat={loadingChat}
            handleAccessChat={handleAccessChat}
          />,
          document.getElementById('modal-portal')
        )}
    </>
  );
};

export default SideDrawer;