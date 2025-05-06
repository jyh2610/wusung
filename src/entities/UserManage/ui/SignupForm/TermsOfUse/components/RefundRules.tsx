import React from 'react';
import { Button, Modal } from '@/shared/ui';
import { modalContainer, termsModalBody, title } from './index.css';

interface IProps {
  isRefundModal: boolean;
  setIsRefundModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export function RefundModal({ isRefundModal, setIsRefundModal }: IProps) {
  return (
    <Modal
      isOpen={isRefundModal}
      setIsOpen={() => setIsRefundModal(prev => !prev)}
      modalSize={{
        width: '860px',
        height: '577px'
      }}
    >
      <div className={modalContainer}>
        <div className={title}>
          <span>환불규정</span>
        </div>

        <div
          className={termsModalBody}
          style={{
            marginTop: '32px',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.75',
            fontSize: '16px',
            height: 'auto'
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            ① 회사의 책임 있는 사유로 서비스에 문제가 발생하여 이용자가 서비스를
            받지 못하여 이용자가 환불을 요청한 경우를 제외하고는 환불 되지
            않습니다.
          </div>

          <div style={{ marginBottom: '8px' }}>
            ② 이용자의 환불요청이 아래 각 호에 해당 될 경우에는 회사는 환불을
            아니 할 수 있습니다.
          </div>

          <ul style={{ paddingLeft: '24px', listStyleType: 'none' }}>
            <li style={{ textIndent: '-12px', paddingLeft: '12px' }}>
              - 이용금액을 결제하고 콘텐츠를 다운로드하거나 이용권 사용이 시작된
              이후 활동지를 프린트 한 경우
            </li>
            <li style={{ textIndent: '-12px', paddingLeft: '12px' }}>
              - 이용자의 컴퓨터 및 시설의 문제로 서비스를 이용하지 못하는 경우.
            </li>
            <li style={{ textIndent: '-12px', paddingLeft: '12px' }}>
              - 남은 기간에 대한 부분 환불을 원하는 경우
            </li>
            <li style={{ textIndent: '-12px', paddingLeft: '12px' }}>
              - 이용고객이 요금결제 후 특별한 사유 없이 환불을 요청하는 경우
            </li>
          </ul>
        </div>
        <div
          style={{
            width: '200px',
            height: '56px',
            margin: '20px auto'
          }}
        >
          <Button
            onClick={() => setIsRefundModal(false)}
            type="brand"
            btnSize="large"
            content="확인"
          />
        </div>
      </div>
    </Modal>
  );
}
