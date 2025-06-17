'use client';

import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';
import https from 'https';
import { getsessionStorageValue, setsessionStorageValue } from '@/lib/utils';
import { useAuthStore } from '@/shared/stores/useAuthStore';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // 쿠키 자동 전송
  headers: {
    'Content-Type': 'application/json'
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false // 개발용 SSL 우회
  })
});

// 요청 인터셉터: 항상 Authorization 헤더에 access token 삽입
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const userInfo = getsessionStorageValue('userInfo');
      const token = userInfo ? JSON.parse(userInfo).token : '';

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

// 응답 인터셉터: 서버가 새 access token을 내려줄 경우 저장
axiosInstance.interceptors.response.use(
  response => {
    // 서버에서 새로운 액세스 토큰을 헤더에 담아 보내는 경우
    const newAccessToken =
      response.headers['authorization'] || response.headers['Authorization'];
    if (newAccessToken) {
      const token = newAccessToken.replace('Bearer ', '');
      updateToken(token);
    }
    return response;
  },
  async error => {
    return handleAxiosError(error);
  }
);

// 토큰 업데이트 유틸리티 함수
const updateToken = (token: string) => {
  try {
    // sessionStorage 업데이트
    const stored = getsessionStorageValue('userInfo');
    if (stored) {
      const parsed = JSON.parse(stored);
      const updated = { ...parsed, token };
      setsessionStorageValue('userInfo', JSON.stringify(updated));

      // Zustand 스토어 업데이트
      useAuthStore.setState({ token });
    }

    // 쿠키 업데이트
    if (typeof window !== 'undefined') {
      document.cookie = `token=${token}; path=/; SameSite=Lax; Secure`;
    }
  } catch (err) {
    console.warn('토큰 저장 실패', err);
  }
};

// 401 응답 시 재시도 로직 포함
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

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    // 서버에서 새로운 액세스 토큰을 헤더에 담아 보내는 경우
    const newAccessToken =
      error.response.headers['authorization'] ||
      error.response.headers['Authorization'];
    if (newAccessToken) {
      const token = newAccessToken.replace('Bearer ', '');

      // 기존 토큰을 버리고 새로운 토큰으로 업데이트
      updateToken(token);

      // 헤더에 새로운 토큰으로 재요청
      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${token}`
      };

      return axiosInstance(originalRequest);
    } else {
      // 새로운 토큰이 없는 경우 (토큰 만료)
      console.warn('액세스 토큰이 만료되었습니다.');
      // 여기서 로그아웃 처리나 다른 처리를 추가할 수 있습니다.
    }
  }

  return Promise.reject(error);
};

// 실제 요청 함수
const request = async <T>(
  config: CustomAxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return axiosInstance(config)
    .then((res: AxiosResponse<T>) => res)
    .catch(handleAxiosError);
};

export default request;
