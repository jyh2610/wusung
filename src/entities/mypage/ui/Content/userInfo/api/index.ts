import request from '@/shared/api/axiosInstance';
import { ApiResponse } from '@/shared/type';
import { UserInfoResponse } from '../type';
import { IFormCompany, IFormIndividual } from '@/entities/UserManage/type';

const checkPwHandler = async (pw: string) => {
  const response = await request<ApiResponse<UserInfoResponse>>({
    method: 'get',
    url: '/api/my-page/account/info',
    params: { password: pw }
  });

  return response;
};

const submitCompanyUserInfoHandler = async (data: IFormCompany, file: File) => {
  const formData = new FormData();
  formData.append('inquiryRegisterDTO', JSON.stringify(data));

  formData.append('files', file);

  const response = await request<ApiResponse<UserInfoResponse>>({
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: '/api/my-page/account/business/edit',
    data: formData
  });

  return response;
};

const submitIndivisualUserInfoHandler = async (
  data: IFormIndividual,
  file: File
) => {
  const formData = new FormData();
  formData.append('inquiryRegisterDTO', JSON.stringify(data));

  formData.append('files', file);

  const response = await request<ApiResponse<UserInfoResponse>>({
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: '/api/my-page/account/personal/edit',
    data: formData
  });

  return response;
};

const deleteUserHandler = async ({
  code,
  phoneNum
}: {
  code: string;
  phoneNum: string;
}) => {
  const response = await request<ApiResponse<UserInfoResponse>>({
    method: 'delete',
    url: '/api/my-page/account/withdraw',
    data: { code, phoneNum }
  });

  return response;
};

const verificationCode = async (phoneNum: string) => {
  try {
    const res = await request<ApiResponse<{ code: string }>>({
      url: '/api/my-page/account/phone/verification/send',
      method: 'POST',
      data: { phoneNum }
    });

    return res.data;
  } catch (error) {
    console.error('인증번호 전송 실패:', error);
    throw error;
  }
};

const confirmVerificationCode = async (payload: {
  code: string;
  phoneNum: string;
}) => {
  try {
    const res = await request<ApiResponse<{ code: string }>>({
      url: '/api/my-page/account/phone/verification/confirm',
      method: 'POST',
      data: { code: payload.code, phoneNum: payload.phoneNum }
    });

    return res.data;
  } catch (error) {
    console.error('인증번호 전송 실패:', error);
    throw error;
  }
};

export {
  checkPwHandler,
  submitCompanyUserInfoHandler,
  submitIndivisualUserInfoHandler,
  deleteUserHandler,
  verificationCode,
  confirmVerificationCode
};
