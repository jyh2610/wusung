// type.ts
export interface IForm {
  type: string;
  title: string;
  content: string;
  files: File[];
}

export interface IInquiryResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
}
