import request from '@/shared/api/axiosInstance';
import { ApiResponse, IManager, PaginatedResponse } from '@/shared/type';
import { IGetInquiryDetail, IInquiry, paymentListDTO } from '../type';
import { PaymentFilter } from '../ui/Content/const';
import { toast } from 'react-toastify';

export const getManager = async () => {
  try {
    const res = await request<ApiResponse<IManager>>({
      url: '/api/my-page/account/business/manager'
    });

    return res.data;
  } catch (error) {
    console.log('담당자 정보 조회 실패', error);
  }
};

export const getPaymentList = async (
  filter: PaymentFilter,
  page: number,
  size: number,
  monthsAgo?: number
) => {
  try {
    const res = await request<ApiResponse<PaginatedResponse<paymentListDTO>>>({
      url: '/api/payment/list',
      params: {
        filter,
        page,
        size,
        monthsAgo
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
    toast.success(res.data.message);
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
      data: {
        name: data.name,
        jobGrade: data.jobGrade,
        address: data.address,
        email: data.email,
        phoneVerificationDTO: {
          code: data.verificationCode,
          phoneNum: data.phoneNumber
        }
      }
    });
    toast.success(res.data.message);
    return res.data;
  } catch (error) {
    toast.error(
      (error as any).response?.data?.message || '수정에 실패했습니다.'
    );
    console.error('인증 실패:', error);
    throw error;
  }
};

export const getCertificate = async () => {
  try {
    const res = await request({
      method: 'GET',
      url: '/api/my-page/account/certificate',
      responseType: 'blob'
    });
    return res;
  } catch (error) {
    console.error('인증서 조회 실패:', error);
    throw error;
  }
};

export const personalInquiry = async (
  page: number,
  size: number,
  monthsAgo?: number
) => {
  try {
    const res = await request<ApiResponse<PaginatedResponse<IInquiry[]>>>({
      method: 'GET',
      url: '/api/inquiry/list',
      params: {
        page,
        size,
        monthsAgo
      }
    });
    return res.data;
  } catch (error) {
    console.error('개인문의 조회 실패:', error);
    throw error;
  }
};

export const getInquiryDetail = async (id: number) => {
  try {
    const res = await request<ApiResponse<IGetInquiryDetail>>({
      method: 'GET',
      url: `/api/inquiry/${id}`
    });
    return res.data;
  } catch (error) {
    console.error('문의 상세 조회 실패:', error);
    throw error;
  }
};

export const addReply = async (id: number, content: string, files?: File[]) => {
  try {
    const formData = new FormData();
    formData.append('commentRegisterDTO', JSON.stringify({ content }));

    if (files && files.length > 0) {
      files.forEach(file => {
        formData.append('files', file);
      });
    }

    const res = await request<ApiResponse<null>>({
      method: 'POST',
      url: `/api/inquiry/${id}/comment/register`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  } catch (error) {
    console.error('답글 등록 실패:', error);
    throw error;
  }
};

export const getUserType = async () => {
  try {
    const res = await request<ApiResponse<{ UserType: string }>>({
      method: 'GET',
      url: '/api/my-page/account/info/type'
    });
    return res.data;
  } catch (error) {
    console.error('사용자 유형 조회 실패:', error);
    throw error;
  }
};
