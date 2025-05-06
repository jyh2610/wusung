import React from 'react';
import { Button, Modal } from '@/shared/ui';
import { rules } from './const';
import { modalContainer, termsModalBody, title } from './index.css';

interface IProps {
  isTermOfUse: boolean;
  setIsTermOfUse: React.Dispatch<React.SetStateAction<boolean>>;
  setTermsValue?: () => void;
}
export function TermsOfUseModal({
  isTermOfUse,
  setIsTermOfUse,
  setTermsValue
}: IProps) {
  console.log(isTermOfUse);
  return (
    <Modal
      isOpen={isTermOfUse}
      setIsOpen={() => setIsTermOfUse(prev => !prev)}
      modalSize={{
        width: '860px',
        height: '877px'
      }}
    >
      <div className={modalContainer}>
        <div className={title}>
          <span>개인정보 처리방침</span>
        </div>
        <pre className={termsModalBody}>{rules}</pre>
        <div
          style={{
            width: '200px',
            height: '56px',
            margin: 'auto'
          }}
        >
          <Button
            onClick={() => {
              setTermsValue && setTermsValue();
              setIsTermOfUse(false);
            }}
            type={'brand'}
            btnSize={'large'}
            content={'확인'}
          />
        </div>
      </div>
    </Modal>
  );
}
