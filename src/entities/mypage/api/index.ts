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
