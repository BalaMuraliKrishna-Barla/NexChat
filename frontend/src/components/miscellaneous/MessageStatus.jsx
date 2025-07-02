// frontend/src/components/miscellaneous/MessageStatus.jsx

import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

const MessageStatus = ({ message, currentUser }) => {
  // We only show status for messages sent by the current user.
  if (message.sender._id !== currentUser._id) {
    return null;
  }

  const myMessageReadColor = '#4FC3F7'; // Bright blue for read
  const myMessageSentColor = 'rgba(255, 255, 255, 0.6)'; // Light grey for sent
  
  // FIX: Logic is now a simple boolean check.
  if (message.isRead) {
    return <CheckCheck size={16} color={myMessageReadColor} className="ml-1" />;
  }

  return <Check size={16} color={myMessageSentColor} className="ml-1" />;
};

export default MessageStatus;