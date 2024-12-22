import request from '@/shared/api/axiosInstance';
import { IPostCheckIdRes } from '../type';

export const checkUserName = async (userName: string) => {
  const res = await request<IPostCheckIdRes>({
    method: 'POST',
    url: '/api/signup/username-check',
    params: {
      username: userName
    }
  });
  return res.data;
};
