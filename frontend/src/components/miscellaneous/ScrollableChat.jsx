// frontend/src/components/miscellaneous/ScrollableChat.jsx
import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { ChatState } from '../../Context/ChatProvider';
import { Download, FileText } from 'lucide-react';
import MessageStatus from './MessageStatus'; 

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
      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 mt-2 bg-gray-200 rounded-lg hover:bg-gray-300">
        <FileText size={40} className="text-red-500 mr-3" />
        <span className="font-medium text-gray-700">View PDF</span>
      </a>
    );
  }

  return (
    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 mt-2 bg-gray-200 rounded-lg hover:bg-gray-300">
      <Download size={40} className="text-gray-500 mr-3" />
      <span className="font-medium text-gray-700">Download File</span>
    </a>
  );
};

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };

  return (
    <ScrollableFeed className="flex flex-col px-2 sm:px-4">
      {messages && messages.map((m, i) => {
        const isMyMessage = m.sender._id === user._id;
        
        return (
          <div key={m._id} className={`flex items-end my-1 ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex flex-col max-w-xs md:max-w-md ${isMyMessage ? 'items-end' : 'items-start'}`}>
              <div
                className={`px-3 py-2 rounded-2xl inline-block ${isMyMessage ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                {/* Show sender's name in group chats */}
                {m.chat.isGroupChat && !isMyMessage && (
                  <p className="text-xs font-bold text-purple-600">{m.sender.name}</p>
                )}
                
                {/* Display either the file or the text content */}
                {m.fileUrl ? 
                  <FileMessage fileUrl={m.fileUrl} fileType={m.fileType} /> : 
                  <p className="text-sm break-words">{m.content}</p>
                }
                
                {/* FIX: Time and Read Receipt Status */}
                <div className="flex justify-end items-center mt-1">
                  <span className={`text-xs ${isMyMessage ? 'text-blue-200' : 'text-gray-500'}`}>
                    {formatTime(m.createdAt)}
                  </span>
                  {isMyMessage && <MessageStatus message={m} chat={m.chat} currentUser={user} />}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;