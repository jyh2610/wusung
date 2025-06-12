import request from '@/shared/api/axiosInstance';
import { ApiResponse, PaginatedResponse } from '@/shared/type';
import { IPayment, IPaymentDetail } from './type';

interface GetPaymentListParams {
  page: number;
  limit: number;
  search?: string;
  memberId?: number;
  status?: 'PENDING' | 'PAID' | 'CANCELLED' | 'FAILED';
  isBankTransferPaymentMethod?: boolean;
  sort?: 'createdAt' | 'paymentId' | 'amount';
  direction?: 'ASC' | 'DESC';
}

export const getPaymentList = async ({
  page,
  limit,
  search,
  memberId,
  status,
  isBankTransferPaymentMethod,
  sort = 'createdAt',
  direction = 'DESC'
}: GetPaymentListParams) => {
  try {
    const response = await request<ApiResponse<PaginatedResponse<IPayment[]>>>({
      url: '/api/admin/payment/list',
      method: 'GET',
      params: {
        page,
        limit,
        search,
        memberId,
        status,
        isBankTransferPaymentMethod,
        sort,
        direction
      }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getPaymentDetail = async (tradeId: number) => {
  try {
    const response = await request<ApiResponse<IPaymentDetail>>({
      url: `/api/admin/payment/${tradeId}`,
      method: 'GET'
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const approvePayment = async (paymentId: string) => {
  try {
    const response = await request<ApiResponse<void>>({
      url: `/api/admin/payment/approve`,
      method: 'POST',
      params: {
        paymentId
      }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getFilter = async () => {
  try {
    const response = await request<ApiResponse<string[]>>({
      url: `/api/admin/payment/list/status-options`,
      method: 'GET'
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getSortList = async () => {
  try {
    const response = await request<ApiResponse<string[]>>({
      url: `/api/admin/payment/list/sort-columns`,
      method: 'GET'
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
