// payment/utils/paymentUtils.ts

import { paymentListDTO } from './type';

export const getStatus = (payment: paymentListDTO) => {
  if (payment.isRefunded) return 'refunded';
  if (payment.canCancel) return 'cancelable';
  if (payment.canRefund) return 'refundable';
  return 'refundable'; // or a separate 'disabled' status if needed
};

export const buttonLabel = (payment: paymentListDTO) => {
  if (payment.isRefunded) return '환불완료';
  if (payment.canCancel) return '취소신청';
  if (payment.canRefund) return '환불신청';
  return '환불 완료';
};

export const statusLabel = (payment: paymentListDTO) => {
  if (payment.isRefunded) return '환불 완료';
  if (payment.canCancel) return '결제 필요';
  if (payment.canRefund) return '결제 완료';
  return '환불 완료';
};
export const getStatusType = (payment: paymentListDTO) => {
  if (payment.isRefunded) return 'refunded';
  if (payment.canCancel) return 'cancelable';
  if (payment.canRefund) return 'refundable';
  return 'disabled';
};
