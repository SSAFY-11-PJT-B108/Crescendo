import React from 'react';
import { Message } from '../../interface/chat';

interface MyProps {
  message: Message;
}
export default function MyMessage({ message }: MyProps) {
  return (
    <div className="MyMessage">
      <span className="created">{message.createdAt.split('T')[0]}</span>
      <span className="message">{message.message}</span>
    </div>
  );
}
