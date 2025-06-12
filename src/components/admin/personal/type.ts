export interface IInquiry {
  inquiryId: number;
  memberId: number;
  type: string;
  title: string;
  content: string;
  haveToReadByAdmin: boolean;
  updatedAt: string;
}

export interface IInquiryDetail {
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

export interface IInquiryComment {
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

export interface IInquiryCommentFile {
  files: string[];
}

export interface IGetInquiryDetail {
  inquiry: IInquiryDetail;
  comments: IInquiryComment[];
  files: string[];
}
