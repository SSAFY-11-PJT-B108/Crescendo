import React from 'react';
import '../../scss/components/signup/_termsmodal.scss';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal = ({ isOpen, onClose }: TermsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="termsmodal-container">
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <h2>커뮤니티 약관</h2>
          <p>크레센도에 가입해주셔서 감사합니다! 아래 약관을 읽고 동의해 주세요:</p>
          <ul>
            <li>1. 회원은 서로 존중하며, 비방이나 욕설을 하지 않습니다.</li>
            <li>2. 커뮤니티 내에서 공유된 정보는 외부에 유출하지 않습니다.</li>
            <li>3. 허가받지 않은 광고, 스팸 행위를 금지합니다.</li>
            <li>4. 저작권을 침해하는 자료를 공유하지 않습니다.</li>
            <li>5. 커뮤니티 활동과 관련하여 타인에게 피해를 주지 않습니다.</li>
          </ul>
          <p>위 약관에 동의하시면 회원 가입을 진행해 주세요.</p>
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
