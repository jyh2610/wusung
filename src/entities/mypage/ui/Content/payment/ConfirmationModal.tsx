// PaymentList.tsx
import { formatKoreanDate } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { getRefundandCancel } from '../../../model/payment'; // 경로 확인
import { paymentListDTO } from '../../../type'; // 경로 확인
import { useState } from 'react'; // useState 훅 임포트
import {
  getStatusType,
  statusLabel,
  getStatus,
  buttonLabel
} from '../../../utils'; // 경로 확인
import {
  label,
  completeText,
  listDate,
  statusText,
  paymentContent,
  payPerMonth,
  currency,
  refundBtn,
  receipt
} from './paymentHistory.css'; // 경로 확인

// 확인 모달 컴포넌트 (예시)
// 실제 사용 시에는 UI 라이브러리의 Modal 컴포넌트를 사용하거나 별도의 컴포넌트를 만드는 것이 좋습니다.
const ConfirmationModal = ({
  isOpen,
  message,
  onConfirm,
  onCancel
}: {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  if (!isOpen) return null;

  // 간단한 모달 스타일 (인라인)
  const modalStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    zIndex: 1000 // 다른 요소 위에 표시
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999 // 모달 뒤에 표시
  };

  return (
    <>
      <div style={overlayStyle} onClick={onCancel} />{' '}
      {/* 오버레이 클릭 시 닫기 */}
      <div style={modalStyle}>
        <p>{message}</p>
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button
            onClick={onCancel}
            style={{
              marginRight: '10px',
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '8px 12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            확인
          </button>
        </div>
      </div>
    </>
  );
};

export const PaymentList = ({
  payment,
  isLast,
  observe
}: {
  payment: paymentListDTO;
  isLast?: boolean;
  observe?: (node: HTMLDivElement | null) => void;
}) => {
  const className = [label, payment.status !== 'PAID' ? completeText : '']
    .join(' ')
    .trim();
  const queryClient = useQueryClient();

  // *** 상태 추가: 모달 표시 여부 ***
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  // *** 함수 추가: 모달 열기 ***
  const openConfirmationModal = () => {
    // 환불/취소 가능할 때만 모달을 열도록 확인
    if (payment.canRefund || payment.canCancel) {
      setIsConfirmationModalOpen(true);
    } else {
      // 예외 상황 처리 (예: 불가능한 버튼 클릭 시 메시지 표시 등)
      console.warn('이 결제는 환불 또는 취소가 불가능합니다.');
    }
  };

  // *** 함수 추가: 모달 닫기 ***
  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  // *** 함수 수정: 실제 취소/환불 로직 (모달 확인 시 호출) ***
  // 기존 reqRefund 내용을 executeAction 함수로 분리
  const executeRefundOrCancel = async () => {
    try {
      // getRefundandCancel 함수의 타입 및 반환 값에 따라 적절하게 await/try/catch 처리
      await getRefundandCancel({
        id: payment.paymentId,
        kind: payment.canRefund ? 'refund' : payment.canCancel ? 'cancel' : '',
        status: payment.canRefund || payment.canCancel || false // status 필드의 정확한 사용법 확인 필요
      });

      // API 호출 성공 후 invalidate
      await queryClient.invalidateQueries({ queryKey: ['paymentList'] });

      // Optional: 성공 메시지 표시 (토스트 알림 등)
    } catch (error) {
      console.error('환불/취소 요청 실패:', error);
      // Optional: 에러 메시지 표시 (토스트 알림 등)
    } finally {
      // API 호출 시도 후 모달 닫기 (성공/실패 상관없이)
      // 필요에 따라서는 성공 시에만 닫거나, 에러 발생 시 모달을 유지할 수도 있습니다.
      closeConfirmationModal();
    }
  };

  // 모달 메시지 결정
  const modalMessage = payment.canRefund
    ? '정말로 환불하시겠습니까?'
    : payment.canCancel
      ? '정말로 취소하시겠습니까?'
      : '이 항목은 환불 또는 취소가 불가능합니다.'; // 혹시라도 모달이 열릴 경우를 대비한 폴백

  return (
    <div ref={isLast ? observe : undefined}>
      {' '}
      {/* PaymentHistory에서 overflowY: auto 스타일은 제거되었어야 합니다. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className={listDate}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span>{formatKoreanDate(payment.paidAt)}</span>
            <span className={statusText({ status: getStatusType(payment) })}>
              {statusLabel(payment)}
            </span>
          </div>
        </div>
        <div className={paymentContent}>
          <span>
            {payment.period_months}개월권
            {payment.status !== 'PENDING' &&
              ` ( ${formatKoreanDate(payment.startDate)} ~ ${formatKoreanDate(payment.endDate)} )`}
          </span>
          <span className={payPerMonth}>
            {payment.amountPaid.toLocaleString()}
            <span className={currency}>원</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={refundBtn({ status: getStatus(payment) })}
            // *** onClick 핸들러 변경: 모달 여는 함수 호출 ***
            onClick={openConfirmationModal}
            // 환불 또는 취소가 불가능할 때 버튼 비활성화
            disabled={!payment.canRefund && !payment.canCancel}
          >
            {buttonLabel(payment)}
          </button>
          {/* receiptUrl이 유효한 URL일 때만 링크 활성화/표시 고려 필요 */}
          <a
            className={receipt} // 'refundable' 상태 클래스가 영수증 버튼에도 적합한지 확인 필요
            href={payment.receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            // 영수증 URL이 없으면 링크 비활성화 또는 숨기기
          >
            영수증
          </a>
        </div>
      </div>
      {/* *** 모달 컴포넌트 렌더링 *** */}
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        message={modalMessage}
        onConfirm={executeRefundOrCancel} // 확인 시 실제 로직 실행
        onCancel={closeConfirmationModal} // 취소 시 모달 닫기
      />
    </div>
  );
};
