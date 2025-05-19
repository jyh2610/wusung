import request from '@/shared/api/axiosInstance';
import {
  IFormCompany,
  IFormIndividual,
  ILoginData,
  IPostCheckIdRes,
  userSub
} from '../type';
import { ApiResponse } from '@/shared/type';

const sendCode = async (payload: {
  name?: string;
  userName?: string;
  phoneNum: string;
}) => {
  const res = await request<ApiResponse<unknown>>({
    method: 'POST',
    url: '/api/common/account/phone/verification/send',
    data: {
      name: payload.name || '',
      userName: payload.userName || '',
      phoneNum: payload.phoneNum
    }
  });
  return res;
};

const findId = async (payload: {
  code: string;
  phoneNum: string;
  name: string;
}) => {
  const res = await request<ApiResponse<string[]>>({
    method: 'POST',
    url: `/api/common/account/phone/verification/confirm/username`,
    data: {
      code: payload.code,
      phoneNum: payload.phoneNum
    },
    params: {
      name: payload.name
    }
  });
  return res;
};

const findPassword = async (payload: {
  code: string;
  phoneNum: string;
  username: string;
}) => {
  const res = await request<ApiResponse<unknown>>({
    method: 'POST',
    url: `/api/common/account/phone/verification/confirm/password`,
    data: {
      code: payload.code,
      phoneNum: payload.phoneNum
    },
    params: {
      username: payload.username
    }
  });
  return res;
};

export { findId, findPassword, sendCode };
