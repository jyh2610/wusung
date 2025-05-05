import request from '@/shared/api/axiosInstance';
import { IManager } from '@/shared/type';

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
