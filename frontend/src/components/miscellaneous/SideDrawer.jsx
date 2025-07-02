// frontend/src/components/miscellaneous/SideDrawer.jsx

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ChatState } from '../../Context/ChatProvider';
import { searchUsers, accessChat } from '../../services/api';
import { Search, X, LoaderCircle } from 'lucide-react';

const SideDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user, setSelectedChat, chats, setChats } = ChatState();

  const handleSearch = async () => {
    if (!search.trim()) {
      toast.warn("Please enter something to search");
      return;
    }
    setLoading(true);
    try {
      const { data } = await searchUsers(search, user.token);
      setSearchResult(data);
    } catch (error) {
      toast.error("Failed to load search results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!search.trim()) {
      setSearchResult([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
        handleSearch();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);
  
  const handleAccessChat = async (userId) => {
    setLoadingChat(true);
    try {
      const { data } = await accessChat(userId, user.token);
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setIsOpen(false);
    } catch (error) {
      toast.error('Error fetching the chat');
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="p-2 rounded-full hover:bg-gray-100 focus:outline-none">
        <Search size={20} className="text-gray-600" />
      </button>
      
      {/* Overlay */}
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black opacity-50 z-20"></div>}

      {/* Side Panel */}
      <div className={`fixed top-0 left-0 h-full bg-white shadow-xl z-30 w-80 p-4 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Search Users</h3>
          <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-gray-200"><X size={20}/></button>
        </div>
        
        <div className="flex gap-2">
            <input 
                type="text" 
                placeholder="Search by name or email" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        <div className="mt-4 h-full overflow-y-auto">
            {loading ? (
                <div className="flex justify-center items-center h-full"><LoaderCircle className="w-6 h-6 text-blue-600 animate-spin" /></div>
            ) : (
                searchResult?.map(u => (
                    <div key={u._id} onClick={() => handleAccessChat(u._id)} className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                        <img src={u.pic} alt={u.name} className="w-10 h-10 rounded-full mr-3" />
                        <div>
                            <p className="font-semibold">{u.name}</p>
                            <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                    </div>
                ))
            )}
            {loadingChat && <div className="flex justify-center items-center p-4"><LoaderCircle className="w-6 h-6 text-blue-600 animate-spin" /></div>}
        </div>
      </div>
    </>
  );
};

export default SideDrawer;