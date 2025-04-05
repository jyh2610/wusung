// axiosInstance.js
import { getLocalStorageValue } from '@/lib/utils';
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
    // 매 요청마다 localStorage에서 최신 토큰 가져오기
    const userInfo = getLocalStorageValue('userInfo');
    const token = userInfo ? JSON.parse(userInfo).token : '';

    // 토큰이 있으면 Authorization 헤더에 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  response => {
    // 응답 데이터 처리
    return response;
  },
  error => {
    // 에러 처리 (예: 401 에러 시 재로그인 처리)
    return Promise.reject(error);
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

  if (error.response?.status === 401) {
    // 401 에러 처리 로직 추가
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
