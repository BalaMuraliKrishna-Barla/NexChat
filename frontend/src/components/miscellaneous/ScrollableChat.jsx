// frontend/src/components/miscellaneous/ScrollableChat.jsx

import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { ChatState } from '../../Context/ChatProvider';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

// Helper functions to determine message layout
const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id || messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};
const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: 'flex' }} key={m._id}>
            {/* Show avatar for last message of a user in a group */}
            {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && m.chat.isGroupChat && (
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip id={`tooltip-${m.sender._id}`}>{m.sender.name}</Tooltip>}
              >
                <img
                  src={m.sender.pic}
                  alt={m.sender.name}
                  className="rounded-circle"
                  style={{ width: '30px', height: '30px', objectFit: 'cover', marginTop: '7px', marginRight: '5px' }}
                />
              </OverlayTrigger>
            )}
            
            <span
              style={{
                backgroundColor: `${m.sender._id === user._id ? '#0d6efd' : '#e9ecef'}`,
                color: `${m.sender._id === user._id ? 'white' : 'black'}`,
                marginLeft: m.sender._id === user._id ? 'auto' : (isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && m.chat.isGroupChat ? '0' : '40px',
                marginTop: '5px',
                borderRadius: '15px',
                padding: '8px 15px',
                maxWidth: '75%',
              }}
            >
              {/* FIX: Show sender's name in group chats above their message */}
              {m.chat.isGroupChat && m.sender._id !== user._id && (
                  <div style={{fontWeight: 'bold', fontSize: '0.8em', marginBottom: '3px'}}>{m.sender.name}</div>
              )}
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;