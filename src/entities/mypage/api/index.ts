import request from '@/shared/api/axiosInstance';
import { ApiResponse, IManager, PaginatedResponse } from '@/shared/type';
import { paymentListDTO } from '../type';

export const getManager = async () => {
  try {
    const res = await request<IManager[]>({
      url: '/api/my-page/account/business/manager'
    });

    return res.data;
  } catch (error) {
    console.log('담당자 정보 조회 실패', error);
  }
};

export const getPaymentList = async (page: number, size: number) => {
  try {
    const res = await request<ApiResponse<PaginatedResponse<paymentListDTO>>>({
      url: '/api/payment/list',
      params: {
        page, // The current page number
        size // The number of items per page
      }
    });

    return res.data;
  } catch (error) {
    console.error('결제 목록 조회 실패:', error);
    throw error;
  }
};

export const reqRefund = async (id: string) => {
  try {
    const res = await request<ApiResponse<null>>({
      url: '/api/payment/refund',
      method: 'POST',
      params: { paymentId: id }
    });

    return res.data;
  } catch (error) {
    console.error('결제 목록 조회 실패:', error);
    throw error;
  }
};

export const verificationNum = async (phoneNum: string) => {
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

export const verificationCode = async (payload: {
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
    console.error('인증 실패:', error);
    throw error;
  }
};

// {
//   "name": "string",
//   "jobGrade": "string",
//   "address": "string",
//   "email": "V_SuwJFpOlqmKR@VyCoRTdmF9y2zq2dxQIFNlTqdcGqDSHsG6YxgWttPW.K0zZeubRrTZ4_pCqmOcI92oZXONx2xTeX8_NlOr-YUJIK703MY.pe",
//   "phoneVerificationDTO": {
//     "code": "string",
//     "phoneNum": "string"
//   }
// }

export const fixUserInfo = async (data: IManager) => {
  try {
    const res = await request<ApiResponse<{ code: string }>>({
      url: '/api/my-page/account/business/manager/edit',
      method: 'POST',
      data
    });

    return res.data;
  } catch (error) {
    console.error('인증 실패:', error);
    throw error;
  }
};
