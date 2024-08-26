import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}
export default function Button({ children, onClick, className }: ButtonProps) {
  return (
    <button onClick={onClick} className={`button ${className}`}>
      {children}
    </button>
  );
}
