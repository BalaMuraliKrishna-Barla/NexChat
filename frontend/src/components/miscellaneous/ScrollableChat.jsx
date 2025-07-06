// frontend/src/components/miscellaneous/ScrollableChat.jsx

import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { ChatState } from '../../Context/ChatProvider';
import { Download, FileText, MessageSquareReply } from 'lucide-react';
import MessageStatus from './MessageStatus';

const FileMessage = ({ fileUrl, fileType, isMyMessage }) => {
  const baseClasses = "flex items-center p-2 mt-1 rounded-lg transition-colors max-w-full";
  const myMessageClasses = isMyMessage
    ? 'bg-indigo-500 hover:bg-indigo-700'
    : 'bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500';
  const iconClasses = `w-8 h-8 mr-3 flex-shrink-0 ${
    isMyMessage ? 'text-white' : 'text-slate-600 dark:text-slate-300'
  }`;
  const textClasses = `font-medium text-sm ${
    isMyMessage ? 'text-white' : 'text-slate-800 dark:text-slate-200'
  }`;

  if (fileType?.startsWith('image/')) {
    return (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="block mt-1">
        <img src={fileUrl} alt="sent file" className="rounded-lg max-w-xs max-h-64 object-cover" />
      </a>
    );
  }

  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${myMessageClasses}`}
    >
      <div className="flex-shrink-0">
        {fileType === 'application/pdf' ? (
          <FileText size={32} className="text-red-500" />
        ) : (
          <Download size={32} className={iconClasses} />
        )}
      </div>
      <span className={textClasses}>
        {fileType === 'application/pdf' ? 'View PDF' : 'Download File'}
      </span>
    </a>
  );
};

// Helper functions to group message bubbles
const isFirstInBlock = (messages, i) =>
  i === 0 || messages[i - 1]?.sender._id !== messages[i]?.sender._id;
const isLastInBlock = (messages, i) =>
  i === messages.length - 1 || messages[i + 1]?.sender._id !== messages[i]?.sender._id;

const ScrollableChat = ({ messages, setReplyingTo }) => {
  const { user } = ChatState();

  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };

  return (
    <ScrollableFeed forceScroll={true} className="flex-grow">
      <div className="px-4 py-2">
        {messages &&
          messages.map((m, i) => {
            const isMyMessage = m.sender._id === user._id;
            const firstInBlock = isFirstInBlock(messages, i);
            const lastInBlock = isLastInBlock(messages, i);

            // --- Bubble Shape Calculation ---
            let borderRadiusClasses = "rounded-2xl";
            if (isMyMessage) {
              borderRadiusClasses =
                firstInBlock && lastInBlock
                  ? 'rounded-2xl'
                  : firstInBlock
                  ? 'rounded-t-2xl rounded-bl-2xl'
                  : lastInBlock
                  ? 'rounded-b-2xl rounded-tl-2xl'
                  : 'rounded-l-2xl';
            } else {
              borderRadiusClasses =
                firstInBlock && lastInBlock
                  ? 'rounded-2xl'
                  : firstInBlock
                  ? 'rounded-t-2xl rounded-br-2xl'
                  : lastInBlock
                  ? 'rounded-b-2xl rounded-tr-2xl'
                  : 'rounded-r-2xl';
            }

            return (
              <div
                key={m._id}
                className={`group flex items-end ${
                  isMyMessage ? 'justify-end' : 'justify-start'
                } ${firstInBlock ? 'mt-3' : 'mt-0.5'}`}
              >
                <div
                  className={`relative px-3 py-2 inline-block ${borderRadiusClasses} ${
                    isMyMessage
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {/* Sender name in group chats */}
                  {m.chat.isGroupChat && !isMyMessage && firstInBlock && (
                    <p className="text-xs font-bold text-purple-500 dark:text-purple-400 mb-1">
                      {m.sender.name}
                    </p>
                  )}

                  {/* Quoted Message (reply) */}
                  {m.parentMessage && (
                    <a
                      href={`#${m.parentMessage._id}`}
                      className="block mb-2 p-2 bg-black/10 dark:bg-black/20 rounded-lg text-xs cursor-pointer hover:bg-black/20 dark:hover:bg-black/30"
                    >
                      <p className="font-bold">{m.parentMessage.sender.name}</p>
                      <p className="truncate opacity-80">
                        {m.parentMessage.content || 'a file'}
                      </p>
                    </a>
                  )}

                  {/* Message Content and Timestamp */}
                  <div className="flex items-end gap-2">
                    <div className="text-sm" style={{ wordBreak: 'break-word' }}>
                      {m.fileUrl ? (
                        <FileMessage
                          fileUrl={m.fileUrl}
                          fileType={m.fileType}
                          isMyMessage={isMyMessage}
                        />
                      ) : (
                        m.content
                      )}
                    </div>

                    <div className="flex-shrink-0 self-end -mb-1">
                      <span
                        className={`text-xs ${
                          isMyMessage
                            ? 'text-indigo-200'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {formatTime(m.createdAt)}
                      </span>
                      {isMyMessage && (
                        <MessageStatus message={m} chat={m.chat} currentUser={user} />
                      )}
                    </div>
                  </div>

                  {/* Reply Button */}
                  <button
                    onClick={() => setReplyingTo(m)}
                    className={`absolute top-1/2 -translate-y-1/2 p-1.5 bg-white dark:bg-slate-600 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 ${
                      isMyMessage ? '-left-4' : '-right-4'
                    }`}
                    aria-label="Reply to message"
                  >
                    <MessageSquareReply size={16} className="text-slate-600 dark:text-slate-300" />
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </ScrollableFeed>
  );
};

export default ScrollableChat;
