export interface Item {
  id: string;
  name: string;
  price: number;
  currency?: string;
}

export interface PreparePaymentRequestDTO {
  productId: number;
  amount: number;
  productName: string;
  name: string;
  email: string;
  phoneNum: string;
}

export interface PreparePaymentResDTO {
  paymentId: string;
  amount: number;
  productName: string;
  currency: string;
}

export interface verifyDTO {
  paymentId: string;
  txId: string;
  failReason: string;
}

export interface VerifyPaymentResponseDTO {
  paymentId: string;
  txId: string;
  failReason: string;
}

export interface VerifyPaymentDTO {
  paymentId: string;
  productName: string;
  amount: number;
  status: 'PAID' | 'FAILED' | string; // 제공된 데이터는 PAID지만, 혹시 몰라 string 포함
  startDate: string;
  endDate: string;
  receiptUrl: string;
  message: string; // 결제 완료 관련 메시지
}

export type PaymentStatus =
  | { status: 'IDLE' }
  | { status: 'PENDING' }
  | { status: 'FAILED'; message: string }
  | { status: 'PAID' };

export interface productListDTO {
  productId: number;
  name: string;
  periodMonths: number;
  price: number;
  description: string;
  imageUrl: string | null;
  discountRate: number;
}
