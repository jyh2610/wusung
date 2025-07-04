// payment/ActionButton.tsx
import { receipt, refundBtn } from './paymentHistory.css';
import { paymentListDTO } from '../../../type';
import { useQueryClient } from '@tanstack/react-query';
import { getRefundandCancel } from '../../../model/payment';
import { buttonLabel, getStatus } from '../../../utils';
import { useRefund } from '../hooks/useRefund';

export const ActionButton = ({ payment }: { payment: paymentListDTO }) => {
  const { requestRefundOrCancel } = useRefund();
  console.log(payment.receiptUrl);

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
        className={receipt({ disabled: !payment.receiptUrl })}
        href={payment.receiptUrl}
        target="_blank"
      >
        영수증
      </a>
    </div>
  );
};
