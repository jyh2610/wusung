export interface IPayment {
  tradeId: number;
  accountName: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  paymentId: string;
  status: string;
  amountTotal: number;
  amountPaid: number;
  amountCancelled: number;
  paymentMethod: string;
  updatedAt: string;
  createdAt: string;
}

export interface IPaymentDetail {
  tradeId: number;
  paymentId: string;
  status: string;
  paymentMethod: string;
  amountTotal: number;
  amountPaid: number;
  amountCancelled: number;
  amountDiscount: number;
  amountVat: number;
  amountSupply: number;
  amountTaxFree: number;
  amountCancelledTaxFree: number;
  paidAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  receiptUrl: string | null;
  productName: string;
  productPeriodMonths: number;
  memberId: number;
}
