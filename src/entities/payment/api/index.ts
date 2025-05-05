import request from '@/shared/api/axiosInstance';
import {
  Item,
  PreparePaymentRequestDTO,
  PreparePaymentResDTO,
  verifyDTO,
  VerifyPaymentDTO,
  VerifyPaymentResponseDTO
} from '../types';

export const getvaildtorItem = async (payload: PreparePaymentRequestDTO) => {
  try {
    const res = await request<PreparePaymentResDTO>({
      url: '/api/payment/prepare',
      method: 'POST',
      data: payload
    });
    return res.data;
  } catch (error) {
    console.log('사전검증 요청 실패', error);
  }
};

export const postAfterValidator = async (payload: verifyDTO) => {
  try {
    const res = await request<{
      data: VerifyPaymentDTO;
      message: string;
    }>({
      url: '/api/payment/verify',
      method: 'POST',
      data: payload
    });
    return res.data;
  } catch (error) {
    console.log('사후검증 요청 실패', error);
  }
};
