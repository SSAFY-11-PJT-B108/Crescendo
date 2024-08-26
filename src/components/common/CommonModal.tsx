import React from 'react';
import Button from './Button';

interface CommonModalProps {
  title: string;
  msg: string;
  onClose: () => void;
  onConfirm: () => void;
  closeOnOutsideClick?: boolean;
}

export default function CommonModal({
  title,
  msg,
  onClose,
  onConfirm,
  closeOnOutsideClick = false,
}: CommonModalProps) {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOutsideClick) onClose();
    e.stopPropagation();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="common-modal-overlay" onClick={handleOverlayClick}>
      <div className="common-modal-content" onClick={handleModalClick}>
        <div className="common-modal-header">
          <div className="common-modal-title">{title}</div>
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>
        <div className="common-modal-body">
          <div className="common-modal-msg">{msg}</div>
        </div>
        <div className="common-modal-btn-container">
          <Button
            className="common-modal-btn"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  );
}
