import request from '@/shared/api/axiosInstance';
import { ILoginData, ILoginRes, ILoginWithCode, ILogoutData } from '../type';
import { ApiResponse } from '@/shared/type';

export const login_code = async ({
  userName,
  password,
  code
}: ILoginWithCode) => {
  const res = await request<ApiResponse<ILoginRes>>({
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
  const res = await request<ApiResponse<ILoginRes>>({
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
