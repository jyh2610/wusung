import { reqRefund } from '../api';
import { toast } from 'react-toastify';

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
