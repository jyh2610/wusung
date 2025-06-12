import { reqRefund } from '../api';
import { toast } from 'react-toastify';
import { paymentListDTO } from '../type';
import { PaymentFilter, paymentFilters } from '../ui/Content/const';

export const getRefundandCancel = async ({
  id,
  kind,
  status
}: {
  id: string;
  kind: string;
  status: boolean;
}) => {
  if (status === false) return toast.warn('환불 또는 취소가 불가능 합니다.');
  try {
    if (kind === 'refund') {
      const res = await reqRefund(id);
      toast.info(res.message);
    }
    if (kind === 'cancel') {
      const res = status && (await reqRefund(id));
      toast.info(res.message);
    }
  } catch (error) {
    console.log(error);
  }
};

export const filterPayments = (
  payments: paymentListDTO[] = [],
  selected: PaymentFilter
): paymentListDTO[] => {
  switch (selected) {
    case paymentFilters.PAID_ONLY:
      return payments.filter(p => p.status === 'PAID');
    case paymentFilters.MONTH_3:
    case paymentFilters.MONTH_6:
    case paymentFilters.MONTH_12:
      const month = parseInt(selected.replace('개월', ''));
      return payments.filter(p => p.period_months === month);
    case paymentFilters.ALL:
    default:
      return payments;
  }
};
