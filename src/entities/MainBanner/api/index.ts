import request from '@/shared/api/axiosInstance';
import { ILoginData, ILoginRes, ILoginWithCode, ILogoutData } from '../type';
import { ApiResponse } from '@/shared/type';
import { toast } from 'react-toastify';

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
export const resendCode = async ({ username }: { username: string }) => {
  try {
    const res = await request<ILoginRes>({
      method: 'POST',
      url: '/api/phone/verification/send',
      data: { username }
    });
    toast.success('인증 코드가 재전송되었습니다.');
    return res.data;
  } catch (error) {
    toast.error('재전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
    console.error(error);
    throw error;
  }
};

export const sendSmsCode = async ({ username }: { username: string }) => {
  try {
    const res = await request<ILoginRes>({
      method: 'POST',
      url: '/api/phone/verification/send/sms',
      data: { username }
    });
    toast.success('인증 코드가 문자로 재전송되었습니다.');
    return res.data;
  } catch (error) {
    toast.error('재전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
    console.error(error);
    throw error;
  }
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
