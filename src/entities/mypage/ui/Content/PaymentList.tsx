import { formatKoreanDate } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { getRefundandCancel } from '../../model/payment';
import { paymentListDTO } from '../../type';
import {
  getStatusType,
  statusLabel,
  getStatus,
  buttonLabel
} from '../../utils';
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

  const reqRefund = async () => {
    await getRefundandCancel({
      id: payment.paymentId,
      kind: payment.canRefund ? 'refund' : payment.canCancel ? 'cancel' : '',
      status: payment.canRefund || payment.canCancel || false
    })
      .then(() => queryClient.invalidateQueries({ queryKey: ['paymentList'] }))
      .catch(() => console.log('error'));
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
            onClick={reqRefund}
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
    </div>
  );
};
