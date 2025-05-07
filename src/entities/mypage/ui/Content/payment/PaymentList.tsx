'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { formatKoreanDate } from '@/lib/utils';
import { getRefundandCancel } from '../../../model/payment';
import { paymentListDTO } from '../../../type';
import {
  getStatusType,
  statusLabel,
  getStatus,
  buttonLabel
} from '../../../utils';
import {
  label,
  completeText,
  listDate,
  statusText,
  paymentContent,
  payPerMonth,
  currency,
  refundBtn
} from './paymentHistory.css';

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

  // ✅ 모달 상태 관리
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'refund' | 'cancel' | null>(null);

  const handleOpenModal = () => {
    const type = payment.canRefund
      ? 'refund'
      : payment.canCancel
        ? 'cancel'
        : null;

    if (type) {
      setModalType(type);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType(null);
  };

  const handleConfirm = async () => {
    if (!modalType) return;

    try {
      await getRefundandCancel({
        id: payment.paymentId,
        kind: payment.canRefund ? 'refund' : payment.canCancel ? 'cancel' : '',
        status: payment.canRefund || payment.canCancel || false
      })
        .then(() =>
          queryClient.invalidateQueries({ queryKey: ['paymentList'] })
        )
        .catch(() => console.log('error'));

      queryClient.invalidateQueries({ queryKey: ['paymentList'] });
    } catch (e) {
      console.error('환불/취소 요청 실패');
    } finally {
      handleCloseModal();
    }
  };

  return (
    <div style={{ overflowY: 'auto' }} ref={isLast ? observe : undefined}>
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
            onClick={handleOpenModal}
            disabled={!payment.canRefund && !payment.canCancel}
          >
            {buttonLabel(payment)}
          </button>
          <a
            className={refundBtn({ status: 'refundable' })}
            href={payment.receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            영수증
          </a>
        </div>
      </div>

      {/* ✅ MUI 모달 */}
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>
          정말 {modalType === 'refund' ? '환불' : '취소'}하시겠어요?
        </DialogTitle>
        <DialogContent>
          이 작업은 되돌릴 수 없습니다. 계속 진행하시겠습니까?
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleCloseModal}>취소</MuiButton>
          <MuiButton
            onClick={handleConfirm}
            color="primary"
            variant="contained"
          >
            확인
          </MuiButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};
