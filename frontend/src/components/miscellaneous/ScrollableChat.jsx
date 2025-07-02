// frontend/src/components/miscellaneous/ScrollableChat.jsx

import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { ChatState } from '../../Context/ChatProvider';
import { Download, FileText, MessageSquareReply } from 'lucide-react';
import MessageStatus from './MessageStatus';

// FileMessage Component (No changes here, but included for completeness)
const FileMessage = ({ fileUrl, fileType }) => {
  if (fileType.startsWith('image/')) {
    return (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer">
        <img src={fileUrl} alt="sent file" className="mt-2 rounded-lg max-w-xs max-h-64 object-cover" />
      </a>
    );
  }
  if (fileType === 'application/pdf') {
    return (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 mt-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
        <FileText size={40} className="text-red-500 mr-3 flex-shrink-0" />
        <span className="font-medium">View PDF</span>
      </a>
    );
  }
  return (
    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 mt-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
      <Download size={40} className="text-gray-500 mr-3 flex-shrink-0" />
      <span className="font-medium">Download File</span>
    </a>
  );
};

const ScrollableChat = ({ messages, setReplyingTo }) => {
  const { user } = ChatState();

  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };

  return (
    <ScrollableFeed>
      {messages && messages.map((m, i) => {
        const isMyMessage = m.sender._id === user._id;

        return (
          // Use a 'group' class for hover effects
          <div key={m._id} className={`group flex items-end my-1 ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex flex-col max-w-xs md:max-w-md ${isMyMessage ? 'items-end' : 'items-start'}`}>
              
              {/* The main message bubble */}
              <div className={`relative px-3 py-2 rounded-2xl inline-block ${isMyMessage ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                
                {/* NEW: Render the parent message if this is a reply */}
                {m.parentMessage && (
                  <div className="mb-2 p-2 bg-black bg-opacity-10 rounded-lg text-xs cursor-pointer">
                    <p className="font-bold">{m.parentMessage.sender.name}</p>
                    <p className="truncate opacity-80">{m.parentMessage.content || "a file"}</p>
                  </div>
                )}
                
                {/* Show sender's name in group chats */}
                {m.chat.isGroupChat && !isMyMessage && (
                  <p className="text-xs font-bold text-purple-600 mb-1">{m.sender.name}</p>
                )}
                
                {/* Display either the file or the text content */}
                {m.fileUrl ? 
                  <FileMessage fileUrl={m.fileUrl} fileType={m.fileType} /> : 
                  <p className="text-sm" style={{ wordBreak: 'break-word' }}>{m.content}</p>
                }
                
                {/* Time and Read Receipt Status */}
                <div className="flex justify-end items-center mt-1">
                  <span className={`text-xs ${isMyMessage ? 'text-blue-200' : 'text-gray-500'}`}>
                    {formatTime(m.createdAt)}
                  </span>
                  {isMyMessage && <MessageStatus message={m} chat={m.chat} currentUser={user} />}
                </div>

                {/* NEW: Reply button that appears on hover */}
                <button 
                  onClick={() => setReplyingTo(m)}
                  className={`absolute top-0 p-1.5 bg-white rounded-full shadow-md transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 ${isMyMessage ? '-left-4' : '-right-4'}`}
                  aria-label="Reply to message"
                >
                  <MessageSquareReply size={16} className="text-gray-600"/>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;