// frontend/src/components/miscellaneous/ChatBox.jsx

import React, { useEffect, useState, useRef } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { toast } from 'react-toastify';
import { ArrowLeft, ArrowDown, Paperclip, Send, Settings, LoaderCircle, X, Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { fetchMessages, sendMessage } from '../../services/api';
import ScrollableChat from './ScrollableChat';
import UpdateGroupChatModal from './UpdateGroupChatModal';
// This is a reference to the currently selected chat, used to avoid a stale state in the socket listener
var selectedChatCompare;

// Helper function to get the other user's full profile from a chat's users array
const getSenderFull = (loggedUser, users) => {
  if (!loggedUser || !users || users.length < 2) return null;
  return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};

const ChatBox = ({ fetchAgain, setFetchAgain, socket }) => {
  // --- STATE MANAGEMENT ---
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [fileToPreview, setFileToPreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  
  // --- REFS ---
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);
  const textInputRef = useRef(null);
  
  // --- GLOBAL STATE ---
  const { user, selectedChat, setSelectedChat, typingStatus } = ChatState();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // This useEffect ensures the chat scrolls to the bottom whenever new messages are loaded or sent.
  useEffect(() => {
    // A small delay ensures the DOM has updated before we try to scroll.
    const timer = setTimeout(() => {
        scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);


  // --- DATA FETCHING & REAL-TIME LOGIC ---

  // Function to load all messages for the selected chat
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

  // Effect for loading messages whenever the selected chat changes
  useEffect(() => {
    loadMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  // Effect to handle all incoming socket events
  useEffect(() => {
    if (!socket) return;

    const messageListener = (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        // Handle notifications for other chats
      } else {
        setMessages((prev) => [...prev, newMessageReceived]);
        socket.emit("mark as read", { chatId: selectedChatCompare._id, userId: user._id });
      }
      setFetchAgain(prev => !prev);
    };

    const readListener = ({ chatId }) => {
      if (chatId === selectedChatCompare?._id) {
        setMessages(prev => prev.map(msg => (msg.sender._id === user._id && !msg.isRead) ? { ...msg, isRead: true } : msg));
      }
    };
    
    socket.on("message recieved", messageListener);
    socket.on("messages read", readListener);

    return () => {
      socket.off("message recieved", messageListener);
      socket.off("messages read", readListener);
    };
  }, [socket, fetchAgain, setFetchAgain, user._id]);
  
  // Close emoji picker if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [emojiPickerRef]);

  // Debounce timer for the "stop typing" event
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
  const handleEmojiClick = (emojiObject) => {
    setNewMessage(prev => prev + emojiObject.emoji);
  };
  
  const handleFileSelection = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileToPreview(file);
    }
  };
  
  const handleScroll = () => {
    const container = messageContainerRef.current;
    if (container) {
      // Check if the user has scrolled up more than a certain amount (e.g., 300 pixels)
      const isScrolledUp = container.scrollHeight - container.scrollTop > container.clientHeight + 300;
      setShowScrollToBottom(isScrolledUp);
    }
  };


  // This new useEffect is dedicated to refocusing the input after a message is sent.
  // It watches the `messages` array for changes.
  useEffect(() => {
    // We check if the last message was sent by the current user.
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender._id === user._id) {
        // If so, focus the input field.
        textInputRef.current?.focus();
      }
    }
  }, [messages, user._id]);

  // The main send handler is now cleaner.
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !fileToPreview) return;

    socket.emit("stop typing", selectedChat._id);
    setTyping(false);
    
    let payload = {
        chatId: selectedChat._id,
        parentMessage: replyingTo?._id,
    };

    if (fileToPreview) {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', fileToPreview);
        formData.append("upload_preset", "Chat-App");
        try {
            const res = await fetch("https://api.cloudinary.com/v1_1/dr8gzltrw/auto/upload", { method: 'POST', body: formData });
            const result = await res.json();
            payload.fileUrl = result.secure_url;
            payload.fileType = fileToPreview.type || result.resource_type;
            // REMOVED: No focus call here.
        } catch (error) {
            toast.error("File upload failed.");
            setUploading(false);
            return;
        }
    } else {
        payload.content = newMessage;
    }

    try {
        setNewMessage("");
        setFileToPreview(null);
        setReplyingTo(null);
        setUploading(true);
        
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

  // --- END OF THE FIX ---

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
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-200">
      {selectedChat ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedChat(null)} className="md:hidden p-1 rounded-full hover:bg-gray-100 text-gray-600">
                <ArrowLeft size={20} />
              </button>
              <img src={selectedChat.isGroupChat ? 'https://i.pravatar.cc/150?u=group' : sender?.pic} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
              <h2 className="text-lg font-semibold text-gray-800">{selectedChat.isGroupChat ? selectedChat.chatName : sender?.name}</h2>
            </div>
            {selectedChat.isGroupChat && (
              <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}>
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600"><Settings size={20} /></button>
              </UpdateGroupChatModal>
            )}
          </div>
          
          {/* Messages Area */}
          <div 
            ref={messageContainerRef}
            onScroll={handleScroll}
            className="relative flex-1 p-2 sm:p-4 overflow-y-auto bg-gray-50"
          >
            {loading ? 
              <div className="flex justify-center items-center h-full"><LoaderCircle className="w-8 h-8 text-blue-600 animate-spin" /></div> 
              : <>
                  <ScrollableChat messages={messages} setReplyingTo={setReplyingTo} />
                  {/* This empty div is our anchor point at the bottom of the messages */}
                  <div ref={messagesEndRef} />
                </>
            }
            
            {/* The "Scroll to Bottom" button, conditionally rendered */}
            {showScrollToBottom && (
                <button 
                    onClick={scrollToBottom}
                    className="absolute bottom-4 right-4 z-10 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-opacity animate-bounce"
                    aria-label="Scroll to bottom"
                >
                    <ArrowDown size={20} />
                </button>
            )}
          </div>
          
          {/* Reply Context Preview Bar */}
          {replyingTo && (
            <div className="p-2 border-t border-b border-gray-200 bg-gray-50">
              <div className="bg-gray-200 p-2 rounded-lg flex items-center justify-between text-sm">
                <div className="border-l-4 border-blue-500 pl-3 min-w-0">
                  <p className="font-bold text-blue-600">Replying to {replyingTo.sender.name === user.name ? "yourself" : replyingTo.sender.name}</p>
                  <p className="text-gray-600 truncate">
                    {replyingTo.content || "a file"}
                  </p>
                </div>
                <button onClick={() => setReplyingTo(null)} className="p-1 text-gray-500 hover:text-red-600 rounded-full">
                  <X size={18} />
                </button>
              </div>
            </div>
          )}

          {/* File Preview Area */}
          {fileToPreview && (
            <div className="p-2 border-t border-gray-200">
              <div className="bg-gray-100 p-2 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  {fileToPreview.type.startsWith("image/") ? (
                    <img src={URL.createObjectURL(fileToPreview)} alt="preview" className="w-10 h-10 rounded-md object-cover"/>
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0"><Paperclip size={20} className="text-gray-500"/></div>
                  )}
                  <span className="text-sm text-gray-700 truncate">{fileToPreview.name}</span>
                </div>
                <button onClick={() => setFileToPreview(null)} disabled={uploading} className="p-1 text-gray-500 hover:text-red-600 rounded-full disabled:opacity-50"><X size={18} /></button>
              </div>
            </div>
          )}

          {/* Typing Indicator */}
          {otherUserIsTyping && <div className="px-4 py-1 text-sm text-gray-500 italic">typing...</div>}

          {/* Input Area */}
          <div className="p-2 sm:p-4 border-t border-gray-200 bg-white">
            <div className="relative">
              {showEmojiPicker && (
                <div ref={emojiPickerRef} className="absolute bottom-14 z-10">
                  <EmojiPicker onEmojiClick={handleEmojiClick} autoFocusSearch={false} height={400} width={320} emojiStyle="native" />
                </div>
              )}
              <form onSubmit={handleSend} className="flex items-center space-x-2">
                <input type="file" ref={fileInputRef} onChange={handleFileSelection} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  disabled={uploading}
                  className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 focus:outline-none disabled:cursor-not-allowed"
                  aria-label="Attach file"
                >
                  {uploading ? <LoaderCircle className="w-5 h-5 text-blue-600 animate-spin" /> : <Paperclip size={20} />}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 focus:outline-none"
                  aria-label="Open emoji picker"
                >
                  <Smile size={20} />
                </button>
                <input
                  ref={textInputRef} // This ref must be on the input element
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={typingHandler}
                  onFocus={() => {
                    setShowEmojiPicker(false);
                    if (socket) {
                      socket.emit("mark as read", { chatId: selectedChat._id, userId: user._id });
                    }
                  }}
                  autoComplete="off"
                  className="flex-1 w-full px-4 py-2 bg-gray-100 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!!fileToPreview || uploading}
                />
                <button
                  type="submit"
                  className="p-3 text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
                  disabled={uploading || (!newMessage.trim() && !fileToPreview)}
                  aria-label="Send message"
                >
                  {uploading ? <LoaderCircle className="w-4 h-4 animate-spin"/> : <Send size={18} />}
                </button>
              </form>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50 rounded-xl">
          <h3 className="text-xl font-medium">Select a chat</h3>
          <p>or search for a user to start messaging.</p>
        </div>
      )}
    </div>
  );
};

export default ChatBox;