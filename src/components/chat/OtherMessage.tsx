import React from 'react';
import { Message } from '../../interface/chat';

interface MessageProps {
  message: Message;
}
export default function OtherMessage({ message }: MessageProps) {
  return (
    <div className="OtherMessage">
      <span className="message">{message.message}</span>
      <span className="created">{message.createdAt.split('T')[0]}</span>
    </div>
  );
}
