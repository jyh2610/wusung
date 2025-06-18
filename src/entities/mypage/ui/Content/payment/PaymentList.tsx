'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
  Alert
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
  refundBtn,
  receipt
} from './paymentHistory.css';
import { Button } from '@/shared/ui';
import { AlertDescription } from '@/components/ui/alert';
import { DialogHeader } from '@/components/ui/dialog';
import { AlertCircle } from 'lucide-react';

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
          queryClient.invalidateQueries({
            predicate: query => query.queryKey[0] === 'paymentList'
          })
        )
        .catch(() => console.log('error'));
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
          <button
            className={receipt({ disabled: !payment.receiptUrl })}
            onClick={() =>
              payment.receiptUrl &&
              window.open(payment.receiptUrl, '_blank', 'noopener,noreferrer')
            }
            disabled={!payment.receiptUrl}
          >
            영수증
          </button>
        </div>
      </div>

      {/* ✅ MUI 모달 */}
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>정말로 결제를 취소하시겠습니까?</DialogTitle>
          </DialogHeader>

          <Alert variant="standard" className="mt-2 border-red-200 bg-red-50">
            <AlertDescription className="ml-2">
              결제 취소 시 현재 이용 중인 서비스가 즉시 중단되며, 이미 사용한
              기간에 대한 환불은 불가능합니다.
            </AlertDescription>
          </Alert>

          <div
            style={{
              paddingTop: '12px'
            }}
          >
            <p className="text-sm text-gray-500">
              구독을 취소하면 현재 결제 주기가 끝날 때까지 서비스를 계속 이용할
              수 있습니다. 다음 결제 주기에는 자동으로 갱신되지 않습니다. [^1]
            </p>
          </div>

          <DialogActions>
            <MuiButton onClick={handleCloseModal}>취소</MuiButton>
            <div
              style={{
                width: '80px',
                height: '32px'
              }}
            >
              <Button content="확인" type="brand" onClick={handleConfirm} />
            </div>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};
