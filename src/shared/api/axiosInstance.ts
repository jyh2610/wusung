'use client';

import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';
import https from 'https';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false // 개발용 SSL 우회
  })
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return '';
      };

      const token = getCookie('token') || '';
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn('토큰 파싱 실패', err);
    }

    return config;
  },
  error => Promise.reject(error)
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  response => {
    console.log('전체 응답:', response);
    console.log('응답 헤더 키들:', Object.keys(response.headers));
    console.log('응답 헤더 전체:', response.headers);

    const newAccessToken =
      response.headers['authorization'] || response.headers['Authorization'];

    console.log('새로운 액세스 토큰:', newAccessToken);
    if (newAccessToken) {
      const token = newAccessToken.replace('Bearer ', '');
      console.log('처리된 토큰:', token);
      updateToken(token);
    }
    return response;
  },
  async error => {
    return handleAxiosError(error);
  }
);

// 토큰 저장
const updateToken = (token: string) => {
  try {
    useAuthStore.setState({ token });
    if (typeof window !== 'undefined') {
      document.cookie = `token=${token}; path=/; SameSite=Lax; Secure`;
    }
  } catch (err) {
    console.warn('토큰 저장 실패', err);
  }
};

// 재시도 처리
export interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const handleAxiosError = async (error: AxiosError) => {
  const originalRequest = error.config as CustomAxiosRequestConfig;

  if (error.response?.status === 403 && !originalRequest._retry) {
    originalRequest._retry = true;

    const newAccessToken =
      error.response.headers['authorization'] ||
      error.response.headers['Authorization'];

    if (newAccessToken) {
      const token = newAccessToken.replace('Bearer ', '');
      updateToken(token);

      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${token}`
      };

      return axiosInstance(originalRequest);
    } else {
      console.warn('액세스 토큰이 만료되었습니다.');

      // 세션 비우기 및 로그아웃 처리
      try {
        useAuthStore.getState().logout();
        localStorage.removeItem('userInfo');
        // 로그아웃 알림 표시
        toast.error('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');

        // 로그인 페이지로 리다이렉트 (선택사항)
        if (typeof window !== 'undefined') {
          window.location.href = '/signin';
        }
      } catch (logoutError) {
        console.error('로그아웃 처리 중 오류:', logoutError);
      }
    }
  }

  return Promise.reject(error);
};

const request = async <T>(
  config: CustomAxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return axiosInstance(config)
    .then((res: AxiosResponse<T>) => res)
    .catch(handleAxiosError);
};

export default request;
