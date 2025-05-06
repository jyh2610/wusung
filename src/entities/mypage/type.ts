export interface paymentListDTO {
  tradeId: number;
  status: 'PAID' | 'CANCELLED' | 'FAILED'; // 필요한 상태 더 추가 가능
  paymentId: string;
  paymentMethod: 'CARD' | 'KAKAOPAY' | 'BANK' | string; // 확장 가능
  amountPaid: number;
  amountCancelled: number;
  paidAt: string; // ISO 날짜 문자열
  cancelledAt?: string; // optional, 일부 상태에만 존재
  receiptUrl: string;
  period_months: number;
  startDate: string;
  endDate: string;
  canRefund: boolean;
  canCancel: boolean;
  isRefunded: boolean;
}
