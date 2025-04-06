import request from '@/shared/api/axiosInstance';
import { ILoginData, ILoginRes, ILogoutData } from '../type';

export const login = async ({ userName, password }: ILoginData) => {
  const res = await request<ILoginRes>({
    method: 'POST',
    url: '/api/login/code',
    data: {
      username: userName,
      password: password,
      code: '000000'
    }
  });
  return res.data;
};

export const logout = async (token: string) => {
  const res = await request<ILogoutData>({
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    url: '/api/logout'
  });
  return res.data;
};
