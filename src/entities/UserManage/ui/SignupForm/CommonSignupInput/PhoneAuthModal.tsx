import React from 'react';
import { Button, Modal } from '@/shared/ui';

interface IProps {
  isModal: boolean;
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function PhoneAuthModal({ isModal, setIsModal }: IProps) {
  return (
    <Modal
      isOpen={isModal}
      setIsOpen={() => setIsModal(prev => !prev)}
      modalSize={{
        width: '494px',
        height: '224px'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: '40px',
          height: '224px',
          width: '494px'
        }}
      >
        <div
          style={{
            fontSize: '24px',
            fontWeight: 400,
            lineHeight: '40px',
            letterSpacing: '-2,5%'
          }}
        >
          인증번호를 발송했어요!
        </div>
        <div
          style={{
            width: '200px',
            height: '56px'
          }}
        >
          <Button
            onClick={() => setIsModal(false)}
            type={'brand'}
            content="확인"
          />
        </div>
      </div>
    </Modal>
  );
}

export default PhoneAuthModal;
