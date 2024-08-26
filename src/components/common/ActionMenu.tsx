import React, { useEffect, useRef } from 'react';

interface ActionMenuProps {
  onClose: () => void;
  onEditAction?: () => void;
  onDeleteAction: () => void;
}

export default function ActionMenu({ onClose, onEditAction, onDeleteAction }: ActionMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef, onClose]);

  return (
    <div ref={menuRef} className="action-menu">
      {onEditAction && (
        <div
          className="action-menu-item"
          onClick={e => {
            onEditAction();
            e.stopPropagation();
          }}
        >
          수정
        </div>
      )}
      <div
        className="action-menu-item"
        onClick={e => {
          onDeleteAction();
          e.stopPropagation();
        }}
      >
        삭제
      </div>
    </div>
  );
}
