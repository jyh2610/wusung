// payment/ActionButton.tsx
import { refundBtn } from './paymentHistory.css';
import { paymentListDTO } from '../../type';
import { useQueryClient } from '@tanstack/react-query';
import { getRefundandCancel } from '../../model/payment';
import { buttonLabel, getStatus } from '../../utils';
import { useRefund } from './hooks/useRefund';

export const ActionButton = ({ payment }: { payment: paymentListDTO }) => {
  const { requestRefundOrCancel } = useRefund();

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button
        className={refundBtn({ status: getStatus(payment) })}
        onClick={() => requestRefundOrCancel(payment)}
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
  );
};
