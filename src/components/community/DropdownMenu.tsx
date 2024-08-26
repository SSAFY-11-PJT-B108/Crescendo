import React from 'react';
import '../../scss/components/community/_dropdownmenu.scss';

interface DropdownMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function DropdownMenu({ onEdit, onDelete }: DropdownMenuProps) {
  return (
    <ul className="feed-detail-menu">
      <li onClick={onEdit}>수정</li>
      <li onClick={onDelete}>삭제</li>
    </ul>
  );
}
