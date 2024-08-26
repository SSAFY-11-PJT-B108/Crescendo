import React from 'react';
import '../../scss/components/community/_dropdownreplymenu.scss';

interface DropdownReplyMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function DropdownReplyMenu({ onEdit, onDelete }: DropdownReplyMenuProps) {
  return (
    <ul className="reply-detail-menu">
      <li onClick={onEdit}>수정</li>
      <li onClick={onDelete}>삭제</li>
    </ul>
  );
}
