// frontend/src/components/miscellaneous/ChatBox.jsx

import React, { useEffect, useState, useRef } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { toast } from 'react-toastify';
import { ArrowLeft, Paperclip, Send, Settings, LoaderCircle, X } from 'lucide-react';
import { fetchMessages, sendMessage } from '../../services/api';
import ScrollableChat from './ScrollableChat';
import UpdateGroupChatModal from './UpdateGroupChatModal';

var selectedChatCompare;

const getSenderFull = (loggedUser, users) => {
  if (!loggedUser || !users || users.length < 2) return null;
  return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};

const ChatBox = ({ fetchAgain, setFetchAgain, socket }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [fileToPreview, setFileToPreview] = useState(null);

  const fileInputRef = useRef(null);
  const { user, selectedChat, setSelectedChat, typingStatus } = ChatState();

  // This is the function that loads messages.
  const loadMessages = async () => {
    // Guard clause: Don't run if the essential data isn't ready.
    if (!selectedChat || !user?.token || !socket) return;
    
    setLoading(true);
    try {
      const { data } = await fetchMessages(selectedChat._id, user.token);
      setMessages(data);
      socket.emit("join chat", selectedChat._id);
      // After successfully loading, immediately tell other clients you've read the messages.
      socket.emit("mark as read", { chatId: selectedChat._id, userId: user._id });
    } catch (error) { 
      toast.error("Failed to Load Messages");
    }
    setLoading(false);
  };

  // Effect for loading messages ONLY when the selected chat changes.
  useEffect(() => {
    loadMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  // Effect for handling all incoming real-time socket events.
  useEffect(() => {
    if (!socket) return;

    const messageListener = (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        // Handle notifications
      } else {
        setMessages((prev) => [...prev, newMessageReceived]);
        socket.emit("mark as read", { chatId: selectedChatCompare._id, userId: user._id });
      }
      setFetchAgain(prev => !prev);
    };

    const readListener = ({ chatId }) => {
      // Check if the read event is for the currently open chat
      if (chatId === selectedChatCompare?._id) {
        setMessages(prevMessages => 
          prevMessages.map(msg => {
            // If the message was sent by YOU and is not yet read, mark it as read.
            if (msg.sender._id === user._id && !msg.isRead) {
              return { ...msg, isRead: true };
            }
            // Otherwise, leave the message as is.
            return msg;
          })
        );
      }
    };
    
    socket.on("message recieved", messageListener);
    socket.on("messages read", readListener);

    return () => {
      socket.off("message recieved", messageListener);
      socket.off("messages read", readListener);
    };
  }, [socket, fetchAgain, setFetchAgain, user._id]);
  
  
  
  const handleFileSelection = (e) => { 
    const file = e.target.files[0]; 
    if (file) { 
      setFileToPreview(file); 
    } 
  };

  const handleSend = async (e) => { 
    e.preventDefault(); 
    socket.emit("stop typing", selectedChat._id); 
    if (fileToPreview) { 
      setUploading(true); 
      const formData = new FormData(); 
      formData.append('file', fileToPreview); 
      formData.append("upload_preset", "Chat-App"); 
      try { 
         const res = await fetch("https://api.cloudinary.com/v1_1/dr8gzltrw/auto/upload", { method: 'POST', body: formData }); 
         const result = await res.json(); 
         const { data } = await sendMessage({ 
          chatId: selectedChat._id, 
          fileUrl: result.secure_url, 
          fileType: fileToPreview.type || result.resource_type, 
        }, user.token); 

         socket.emit("new message", data); 
         setMessages([...messages, data]); 
         setFileToPreview(null); 
        } catch (error) { 
          toast.error("File upload failed."); 
        } finally { 
          setUploading(false); 
        } 
      } else if (newMessage.trim()) { 
        try { 
          const tempMessage = newMessage; 
          setNewMessage(""); 
          const { data } = await sendMessage({ 
            content: tempMessage, 
            chatId: selectedChat._id 
          }, user.token); 

          socket.emit("new message", data); 
          setMessages([...messages, data]); 
        } catch (error) { 
          toast.error("Failed to send message"); 
        } 
      } 
      setFetchAgain(!fetchAgain);
    };

  const typingHandler = (e) => { 
    setNewMessage(e.target.value); 
    if (!socket || !!fileToPreview) 
      return; 
    if (!typing) { 
      setTyping(true); 
      socket.emit("typing", selectedChat._id); 
    } 
  };

  useEffect(() => { 
    if (!socket) return; 
    const timer = setTimeout(() => { 
      if (typing) { 
        socket.emit("stop typing", selectedChat._id); setTyping(false);
       } 
      }, 3000); 
      return () => clearTimeout(timer); 
    }, [newMessage, socket, typing, selectedChat]);

  const sender = getSenderFull(user, selectedChat?.users);
  const otherUserIsTyping = typingStatus[selectedChat?._id];

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-200">
      {selectedChat ? (
        <>
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedChat(null)} className="md:hidden p-1 rounded-full hover:bg-gray-100 text-gray-600"><ArrowLeft size={20} /></button>
              <img src={selectedChat.isGroupChat ? 'https://i.pravatar.cc/150?u=group' : sender?.pic} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
              <h2 className="text-lg font-semibold text-gray-800">{selectedChat.isGroupChat ? selectedChat.chatName : sender?.name}</h2>
            </div>
            {selectedChat.isGroupChat && (<UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}><button className="p-2 rounded-full hover:bg-gray-100 text-gray-600"><Settings size={20} /></button></UpdateGroupChatModal>)}
          </div>
          <div className="flex-1 p-2 sm:p-4 overflow-y-auto bg-gray-50">
            {loading ? <div className="flex justify-center items-center h-full"><LoaderCircle className="w-8 h-8 text-blue-600 animate-spin" /></div> : <ScrollableChat messages={messages} />}
          </div>
          {fileToPreview && (<div className="p-2 border-t border-gray-200"><div className="bg-gray-100 p-2 rounded-lg flex items-center justify-between"><div className="flex items-center gap-2 min-w-0">{fileToPreview.type.startsWith("image/") ? (<img src={URL.createObjectURL(fileToPreview)} alt="preview" className="w-10 h-10 rounded-md object-cover"/>) : (<div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0"><Paperclip size={20} className="text-gray-500"/></div>)}<span className="text-sm text-gray-700 truncate">{fileToPreview.name}</span></div><button onClick={() => setFileToPreview(null)} disabled={uploading} className="p-1 text-gray-500 hover:text-red-600 rounded-full disabled:opacity-50"><X size={18} /></button></div></div>)}
          {otherUserIsTyping && <div className="px-4 py-1 text-sm text-gray-500 italic">typing...</div>}
          <div className="p-2 sm:p-4 border-t border-gray-200 bg-white">
            <form onSubmit={handleSend} className="flex items-center space-x-2">
              <input type="file" ref={fileInputRef} onChange={handleFileSelection} className="hidden" />
              <button type="button" onClick={() => fileInputRef.current.click()} disabled={uploading} className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 focus:outline-none disabled:cursor-not-allowed"><Paperclip size={20} /></button>
              <input type="text" placeholder="Type a message..." value={newMessage} onChange={typingHandler} autoComplete="off" className="flex-1 w-full px-4 py-2 bg-gray-100 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={!!fileToPreview}/>
              <button type="submit" className="p-3 text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" disabled={uploading}>{uploading ? <LoaderCircle className="w-4 h-4 animate-spin"/> : <Send size={18} />}</button>
            </form>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50 rounded-xl"><h3 className="text-xl font-medium">Select a chat</h3><p>or search for a user to start messaging.</p></div>
      )}
    </div>
  );
};

export default ChatBox;