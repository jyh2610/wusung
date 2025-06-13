export interface paymentListDTO {
  tradeId: number;
  status: 'PAID' | 'CANCELLED' | 'FAILED' | 'PENDING'; // 필요한 상태 더 추가 가능
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

export interface IInquiry {
  inquiryId: number;
  memberId: number;
  type: string;
  title: string;
  content: string;
  fileIdList: string;
  isAnswered: boolean;
  haveToReadByAdmin: boolean;
  haveToReadByUser: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Reply {
  commentId: string;
  content: string;
}

export interface Comment {
  commentId: number;
  memberId: number;
  inquiryId: number;
  answerOrder: number;
  isAnswered: boolean;
  content: string;
  fileIdList: string;
  createdAt: string;
  updatedAt: string;
}

export interface File {
  fileId: number;
  fileName: string;
  fileUrl: string;
}

export interface IGetInquiryDetail {
  inquiry: IInquiry;
  comments: Comment[];
  files: File[];
}
