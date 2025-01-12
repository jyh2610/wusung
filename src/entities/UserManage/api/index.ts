import request from '@/shared/api/axiosInstance';
import { ILoginData, IPostCheckIdRes } from '../type';

export const checkUserName = async (userName: string) => {
  const res = await request<IPostCheckIdRes>({
    method: 'POST',
    url: '/api/signup/username-check',
    data: {
      username: userName
    }
  });
  return res.data;
};

export const verifyPhoneNum = async (num: string) => {
  const res = await request<IPostCheckIdRes>({
    method: 'POST',
    url: '/api/signup/phone/verification/send',
    data: {
      phoneNum: num
    }
  });
  return res.data;
};

interface IAuthenticationNumber {
  code: string;
  phoneNum: string;
}

export const checkAuthenticationNumber = async ({
  code,
  phoneNum
}: IAuthenticationNumber) => {
  const res = await request<IPostCheckIdRes>({
    method: 'POST',
    url: '/api/signup/phone/verification/confirm',
    data: {
      code,
      phoneNum
    }
  });
  return res.data;
};

interface ICheckCorporate {
  b_no: string;
  start_dt: string;
  p_nm: string;
  b_nm: string;
}

export const verifyCoporate = async ({
  b_no,
  start_dt,
  p_nm,
  b_nm
}: ICheckCorporate) => {
  const res = await request<IPostCheckIdRes>({
    method: 'POST',
    url: '/api/signup/corporate/verification',
    data: {
      b_no,
      start_dt,
      p_nm,
      b_nm
    }
  });
  return res.data;
};
