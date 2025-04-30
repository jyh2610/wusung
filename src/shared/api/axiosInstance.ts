'use client';

import { getLocalStorageValue, setLocalStorageValue } from '@/lib/utils';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import https from 'https';

const axiosInstance = axios.create({
  baseURL: 'https://13.124.172.100.sslip.io',
  headers: {
    'Content-Type': 'application/json'
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false // SSL 인증서 검사 무시
  })
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  config => {
    const userInfo = getLocalStorageValue('userInfo');
    const token = userInfo ? JSON.parse(userInfo).token : '';

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  response => {
    // ✅ 서버가 새 access token을 응답 헤더로 보내는 경우 처리
    const newAccessToken = response.headers['authorization'];

    if (newAccessToken) {
      const token = newAccessToken.replace('Bearer ', '');
      const storedUserInfo = getLocalStorageValue('userInfo');

      if (storedUserInfo) {
        const parsed = JSON.parse(storedUserInfo);
        const updatedUserInfo = { ...parsed, token };
        setLocalStorageValue('userInfo', JSON.stringify(updatedUserInfo));
      }
    }

    return response;
  },
  async error => {
    return handleAxiosError(error);
  }
);

export interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const handleAxiosError = async (error: AxiosError) => {
  console.error('Axios error:', error);

  const originalRequest = error.config as CustomAxiosRequestConfig;

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    const newAccessToken = error.response.headers['authorization'];

    if (newAccessToken) {
      const token = newAccessToken.replace('Bearer ', '');
      const storedUserInfo = getLocalStorageValue('userInfo');

      if (storedUserInfo) {
        const parsed = JSON.parse(storedUserInfo);
        const updatedUserInfo = { ...parsed, token };
        setLocalStorageValue('userInfo', JSON.stringify(updatedUserInfo));
      }

      // 헤더에 새로운 토큰 추가 후 재시도
      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${token}`
      };

      return axiosInstance(originalRequest); // 요청 재시도
    }
  }

  return Promise.reject(error);
};

const request = async <T>(
  param: CustomAxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return axiosInstance(param)
    .then((res: AxiosResponse<T>) => res)
    .catch(handleAxiosError);
};

export default request;
