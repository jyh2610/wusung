import request from '@/shared/api/axiosInstance';
import { ILoginData, ILoginRes, ILogoutData } from '../type';

export const login = async ({ userName, password }: ILoginData) => {
  const res = await request<ILoginRes>({
    method: 'POST',
    url: 'https://13.124.172.100.sslip.io/api/login',
    data: {
      username: userName,
      password: password
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
