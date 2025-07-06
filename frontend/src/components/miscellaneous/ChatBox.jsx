// frontend/src/components/miscellaneous/ChatBox.jsx

import React, { useEffect, useState, useRef } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { toast } from 'react-toastify';
import { ArrowLeft, ArrowDown, Paperclip, Send, Settings, LoaderCircle, X, Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { fetchMessages, sendMessage, uploadToCloudinary } from '../../services/api';
import ScrollableChat from './ScrollableChat';
import UpdateGroupChatModal from './UpdateGroupChatModal';

// A reference to the selected chat object, stored outside the component.
// This helps prevent issues with stale state inside socket event listeners.
var selectedChatCompare;

/**
 * A helper function to get the other user's full profile from a chat's users array.
 * @param {object} loggedUser - The currently logged-in user object.
 * @param {array} users - The array of users in the chat.
 * @returns {object} The user object of the other participant in a one-on-one chat.
 */
const getSenderFull = (loggedUser, users) => {
  if (!loggedUser || !users || users.length < 2) return null;
  return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};

/**
 * The main component for displaying and interacting with a selected chat.
 * It handles message fetching, sending, real-time updates, and user interactions.
 */
const ChatBox = ({ fetchAgain, setFetchAgain, socket }) => {
  // --- STATE MANAGEMENT ---
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [fileToPreview, setFileToPreview] = useState(null);
  // NEW: State to control the visibility of the "scroll to bottom" arrow
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  
  // --- REFS ---
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const messageContainerRef = useRef(null); // Ref for the scrollable message area
  const textInputRef = useRef(null);
  
  // --- CONTEXT & GLOBAL STATE ---
  const { user, selectedChat, setSelectedChat, typingStatus, theme } = ChatState();

  // --- DATA FETCHING & REAL-TIME LOGIC ---

  // Fetches all messages for the currently selected chat from the API.
  const loadMessages = async () => {
    if (!selectedChat) return;
    setLoading(true);
    try {
      const { data } = await fetchMessages(selectedChat._id, user.token);
      setMessages(data);
      if(socket) {
        socket.emit("join chat", selectedChat._id);
        socket.emit("mark as read", { chatId: selectedChat._id, userId: user._id });
      }
    } catch (error) { 
      toast.error("Failed to Load Messages");
    }
    setLoading(false);
  };

  // This effect runs whenever the selected chat changes, triggering a re-fetch of messages.
  useEffect(() => {
    loadMessages();
    selectedChatCompare = selectedChat; // Update the comparison object
  }, [selectedChat]);

  // This effect sets up and cleans up all socket.io event listeners for real-time updates.
  useEffect(() => {
    if (!socket) return;

    // Listener for new incoming messages
    const messageListener = (newMessageReceived) => {
      // If the message is for the currently open chat, append it to the state.
      // Otherwise, it will be handled as a notification elsewhere.
      if (selectedChatCompare && selectedChatCompare._id === newMessageReceived.chat._id) {
        setMessages((prev) => [...prev, newMessageReceived]);
        socket.emit("mark as read", { chatId: selectedChatCompare._id, userId: user._id });
      }
      setFetchAgain(prev => !prev); // Trigger a fetch in MyChats to update latest message
    };

    // Listener to update message status to "read"
    const readListener = ({ chatId }) => {
      if (chatId === selectedChatCompare?._id) {
        setMessages(prev => prev.map(msg => ({ ...msg, isRead: true })));
      }
    };
    
    socket.on("message recieved", messageListener);
    socket.on("messages read", readListener);

    // Cleanup function to remove listeners when the component unmounts
    return () => {
      socket.off("message recieved", messageListener);
      socket.off("messages read", readListener);
    };
  }, [socket, fetchAgain, setFetchAgain, user._id]);
  
  // Effect to close the emoji picker when clicking outside of it.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [emojiPickerRef]);

  // Effect for the "stop typing" indicator with a 3-second debounce.
  useEffect(() => {
    if (!socket) return;
    const timer = setTimeout(() => {
      if (typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [newMessage, socket, typing, selectedChat]);


  // --- EVENT HANDLERS ---
  const handleEmojiClick = (emojiObject) => setNewMessage(prev => prev + emojiObject.emoji);
  const handleFileSelection = (e) => {
    const file = e.target.files[0];
    if (file) {
      if(file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("File is too large. Max size is 10MB.");
        return;
      }
      setFileToPreview(file);
    }
  };
  
  const handleScroll = () => {
    const container = messageContainerRef.current;
    if (container) {
      const isScrolledUp = container.scrollHeight - container.scrollTop > container.clientHeight + 200;
      setShowScrollToBottom(isScrolledUp);
    }
  };

  // Main handler for sending a message (text or file).
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !fileToPreview) return;
    socket.emit("stop typing", selectedChat._id);
    setTyping(false);
    let payload = { chatId: selectedChat._id, parentMessage: replyingTo?._id };
    if (fileToPreview) {
        setUploading(true);
        try {
            const result = await uploadToCloudinary(fileToPreview);
            payload.fileUrl = result.secure_url;
            payload.fileType = fileToPreview.type || result.resource_type;
        } catch (error) { toast.error("File upload failed."); setUploading(false); return; }
    } else {
        payload.content = newMessage;
    }
    try {
        setNewMessage(""); setFileToPreview(null); setReplyingTo(null); setUploading(true);
        const { data } = await sendMessage(payload, user.token);
        socket.emit("new message", data);
        setMessages(prev => [...prev, data]);
        setFetchAgain(prev => !prev);
    } catch (error) {
        toast.error("Failed to send message.");
    } finally {
        setUploading(false);
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socket || !!fileToPreview) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
  };

  const sender = getSenderFull(user, selectedChat?.users);
  const otherUserIsTyping = typingStatus[selectedChat?._id];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      {selectedChat ? (
        <>
          {/* Section 1: Chat Header */}
          <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedChat(null)} className="md:hidden p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Back to chats"><ArrowLeft size={20} /></button>
              <img src={selectedChat.isGroupChat ? (selectedChat.groupIcon || 'https://i.pravatar.cc/150?u=group') : sender?.pic} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{selectedChat.isGroupChat ? selectedChat.chatName : sender?.name}</h2>
            </div>
            {selectedChat.isGroupChat && <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}><button className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Group settings"><Settings size={20} /></button></UpdateGroupChatModal>}
          </div>
  
          {/* Section 2: Messages Area */}
          <div ref={messageContainerRef} onScroll={handleScroll} className="relative flex-1 overflow-y-auto bg-slate-200 dark:bg-slate-900" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6h-2zM28 18c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6h-2zM46 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6h-2zM10 26c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6h-2zM28 0c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6h-2c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2zM46 26c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
            <div className="dark:bg-slate-900/50 absolute inset-0"></div>
            <div className="relative z-10 h-full">
              {loading ? <div className="flex justify-center items-center h-full"><LoaderCircle className="w-8 h-8 text-indigo-600 animate-spin" /></div> : <ScrollableChat messages={messages} setReplyingTo={setReplyingTo} />}
            </div>
            {/* NEW: Conditionally rendered scroll-to-bottom arrow */}
            {showScrollToBottom && <button onClick={() => messageContainerRef.current.scrollTo({ top: messageContainerRef.current.scrollHeight, behavior: 'smooth' })} className="absolute bottom-4 right-4 z-10 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-opacity animate-bounce" aria-label="Scroll to bottom"><ArrowDown size={20} /></button>}
          </div>
  
          {/* Section 3: Previews and Indicators */}
          <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-700 p-2 space-y-2 bg-white dark:bg-slate-800">
            {replyingTo && <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg flex items-center justify-between text-sm"><div className="border-l-4 border-indigo-500 pl-3 min-w-0"><p className="font-bold text-indigo-600 dark:text-indigo-400">Replying to {replyingTo.sender.name === user.name ? 'yourself' : replyingTo.sender.name}</p><p className="text-slate-600 dark:text-slate-300 truncate">{replyingTo.content || 'a file'}</p></div><button onClick={() => setReplyingTo(null)} className="p-1 text-slate-400 hover:text-red-500 rounded-full"><X size={18} /></button></div>}
            {fileToPreview && <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg flex items-center justify-between"><div className="flex items-center gap-2 min-w-0">{fileToPreview.type.startsWith('image/') ? <img src={URL.createObjectURL(fileToPreview)} alt="preview" className="w-10 h-10 rounded-md object-cover"/> : <div className="w-10 h-10 bg-slate-200 dark:bg-slate-600 rounded-md flex items-center justify-center flex-shrink-0"><Paperclip size={20} className="text-slate-500 dark:text-slate-300"/></div>}<span className="text-sm text-slate-700 dark:text-slate-200 truncate">{fileToPreview.name}</span></div><button onClick={() => setFileToPreview(null)} disabled={uploading} className="p-1 text-slate-400 hover:text-red-500 rounded-full disabled:opacity-50"><X size={18} /></button></div>}
            {otherUserIsTyping && <div className="px-2 text-sm text-slate-500 dark:text-slate-400 italic">typing...</div>}
          </div>

          {/* Section 4: Input Area */}
          <div className="p-2 sm:p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <div className="relative flex items-center">
              {showEmojiPicker && <div ref={emojiPickerRef} className="absolute bottom-12 z-10"><EmojiPicker onEmojiClick={handleEmojiClick} autoFocusSearch={false} height={350} width={300} theme={theme} /></div>}
              <div className="flex items-center">
                <input type="file" ref={fileInputRef} onChange={handleFileSelection} className="hidden" accept="image/*,video/*,application/pdf" />
                <button type="button" onClick={() => fileInputRef.current.click()} disabled={uploading} className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Attach file">{uploading ? <LoaderCircle className="w-5 h-5 animate-spin" /> : <Paperclip size={20} />}</button>
                <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Open emoji picker"><Smile size={20} /></button>
              </div>
              <form onSubmit={handleSend} className="flex-1 ml-2">
                <div className="relative">
                  <input ref={textInputRef} type="text" placeholder="Type a message..." value={newMessage} onChange={typingHandler} onFocus={() => { setShowEmojiPicker(false); if (socket) socket.emit('mark as read', { chatId: selectedChat._id, userId: user._id }); }} autoComplete="off" className="w-full px-4 py-2 pr-12 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={!!fileToPreview || uploading} />
                  <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-indigo-600 disabled:opacity-50" disabled={uploading || (!newMessage.trim() && !fileToPreview)} aria-label="Send message">{uploading ? <LoaderCircle className="w-4 h-4 animate-spin"/> : <Send size={20} />}</button>
                </div>
              </form>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-xl">
          <h3 className="text-xl font-medium">Select a conversation</h3>
          <p className="max-w-xs">Start a new chat by searching for a user, or continue an existing conversation.</p>
        </div>
      )}
    </div>
  );
};

export default ChatBox;