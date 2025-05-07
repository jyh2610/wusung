import { getRefundandCancel } from '@/entities/mypage/model/payment';
import { paymentListDTO } from '@/entities/mypage/type';
import { useQueryClient } from '@tanstack/react-query';

export const useRefund = () => {
  const queryClient = useQueryClient();

  const requestRefundOrCancel = async (payment: paymentListDTO) => {
    const kind = payment.canRefund
      ? 'refund'
      : payment.canCancel
        ? 'cancel'
        : '';
    const status = payment.canRefund || payment.canCancel;

    if (!kind || !status) return;

    try {
      await getRefundandCancel({ id: payment.paymentId, kind, status });
      queryClient.invalidateQueries({ queryKey: ['paymentList'] });
    } catch (e) {
      console.error('환불/취소 실패', e);
    }
  };

  return { requestRefundOrCancel };
};
