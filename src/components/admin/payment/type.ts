export interface IPayment {
  tradeId: number;
  name: string;
  paymentId: string;
  status: string;
  amountTotal: number;
  amountPaid: number;
  amountCancelled: number;
  paymentMethod: string;
  updatedAt: string;
  createdAt: string;
}
