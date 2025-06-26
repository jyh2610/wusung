import request from '@/shared/api/axiosInstance';
import { ApiResponse } from '@/shared/type';
import { UserInfoResponse } from '../type';
import { IFormCompany, IFormIndividual } from '@/entities/UserManage/type';
import { toast } from 'react-toastify';

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

  // 서버 요청 형식에 맞게 데이터 재가공
  const businessAccountEditDTO = {
    representativeName: data.representativeName,
    name: data.companyName,
    address: data.address + '|' + data.detailAddress,
    email: data.email,
    phoneVerificationDTO: {
      code: data.verificationCode,
      phoneNum: data.phone
    },
    businessRegistrationNumber: data.corporateNumber,
    birthOrEstablishmentDate: data.openingDate
  };

  formData.append(
    'businessAccountEditDTO',
    JSON.stringify(businessAccountEditDTO)
  );

  if (file) {
    formData.append('file', file);
  }

  try {
    const response = await request<ApiResponse<UserInfoResponse>>({
      method: 'PUT',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      url: '/api/my-page/account/business/edit',
      data: formData
    });
    toast.success(response.data.message);
    return response;
  } catch (error: any) {
    toast.error(
      error.response?.data?.message || '회원정보 수정 중 오류가 발생했습니다.'
    );
    throw error;
  }
};

const submitIndivisualUserInfoHandler = async (
  data: IFormIndividual,
  file: File
) => {
  const formData = new FormData();

  // 서버 요청 형식에 맞게 데이터 재가공
  const personalAccountEditDTO = {
    name: data.name,
    address: data.address + '|' + data.detailAddress,
    email: data.email,
    phoneVerificationDTO: {
      code: data.verificationCode,
      phoneNum: data.phone
    },
    birthOrEstablishmentDate: `${data.birth.year}${data.birth.month}${data.birth.day}`
  };

  formData.append(
    'personalAccountEditDTO',
    JSON.stringify(personalAccountEditDTO)
  );
  if (file) {
    formData.append('file', file);
  }

  try {
    const response = await request<ApiResponse<UserInfoResponse>>({
      method: 'PUT',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      url: '/api/my-page/account/personal/edit',
      data: formData
    });
    toast.success(response.data.message);
    return response;
  } catch (error: any) {
    toast.error(error.response.data.message);
    throw error;
  }
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
