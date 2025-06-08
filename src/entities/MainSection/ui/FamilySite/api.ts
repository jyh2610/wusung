import request from '@/shared/api/axiosInstance';
import { ApiResponse } from '@/shared/type';

export interface IFamilyResponse {
  partnerId: number;
  name: string;
  description: string;
  imageUrl: string;
  link: string;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getFamilySiteList = async () => {
  const res = request<ApiResponse<IFamilyResponse>>({
    method: 'GET',
    url: '/api/common/main/partner/list'
  });
  return res;
};
