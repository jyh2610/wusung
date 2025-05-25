import request from '@/shared/api/axiosInstance';
import { ApiResponse } from '@/shared/type';
import { IForm, IInquiryResponse } from '../type.d';

export const regInquiry = async (data: IForm) => {
  const formData = new FormData();
  // inquiryRegisterDTO 객체 생성
  const inquiryRegisterDTO = {
    type: data.type,
    title: data.title,
    content: data.content
  };
  formData.append('inquiryRegisterDTO', JSON.stringify(inquiryRegisterDTO));
  if (data.files && Array.isArray(data.files)) {
    data.files.forEach(file => {
      formData.append('files', file);
    });
  }

  const res = request<ApiResponse<IInquiryResponse>>({
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: '/api/inquiry/register',
    data: formData
  });
  return res;
};
