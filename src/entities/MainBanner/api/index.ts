import request from '@/shared/api/axiosInstance';
import { ILoginData, ILoginRes, ILoginWithCode, ILogoutData } from '../type';
import { ApiResponse } from '@/shared/type';

export const login_code = async ({
  userName,
  password,
  code
}: ILoginWithCode) => {
  const res = await request<ILoginRes>({
    method: 'POST',
    url: '/api/login/code',
    data: {
      username: userName,
      password: password,
      code: code
    }
  });
  return res.data;
};

export const login = async ({ userName, password }: ILoginData) => {
  const res = await request<ILoginRes>({
    method: 'POST',
    url: '/api/login',
    data: {
      username: userName,
      password: password
    }
  });

  return res.data;
};

export const logout = async () => {
  const res = await request<ILogoutData>({
    method: 'POST',
    url: '/api/logout'
  });
  return res.data;
};

export interface IMainBannerResponse {
  type: 'slide_banner' | 'story_banner';
  displayOrder: number;
  url: string;
}

export const getMainBanner = async (type: 'slide_banner' | 'story_banner') => {
  try {
    const res = await request<ApiResponse<IMainBannerResponse[]>>({
      method: 'GET',
      url: `/api/common/main/banner/${type}/list`,
      params: {
        type: type
      }
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
