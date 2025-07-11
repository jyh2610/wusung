// payment/utils/paymentUtils.ts

import { IInquiry, paymentListDTO } from './type';

export const getStatus = (payment: paymentListDTO) => {
  if (payment.isRefunded) return 'refunded';
  if (payment.canCancel) return 'cancelable';
  if (payment.canRefund) return 'refundable';
  return 'paid';
};

export const buttonLabel = (payment: paymentListDTO) => {
  if (payment.isRefunded) return '환불완료';
  if (payment.canCancel) return '취소신청';
  if (payment.canRefund) return '환불신청';
  return '결제완료';
};

export const statusLabel = (payment: paymentListDTO) => {
  if (payment.isRefunded) return '환불 완료';
  if (payment.canCancel) return '결제 필요';
  if (payment.canRefund) return '결제완료';
  return '결제완료';
};
export const getStatusType = (payment: paymentListDTO) => {
  if (payment.isRefunded) return 'refunded';
  if (payment.canCancel) return 'cancelable';
  if (payment.canRefund) return 'refundable';
  return 'paid';
};

export const filterInquiries = (
  inquiries: IInquiry[],
  selected: string
): IInquiry[] => {
  if (selected === '전체') return inquiries;
  const monthsMap: Record<string, number> = {
    '3개월전': 3,
    '6개월전': 6,
    '12개월전': 12
  };
  const months = monthsMap[selected] || 0;
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months);
  return inquiries.filter(inquiry => new Date(inquiry.updatedAt) >= cutoffDate);
};
