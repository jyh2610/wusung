// axiosInstance.js
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import https from 'https';

const userInfo = localStorage.getItem('userInfo');
const token = userInfo ? JSON.parse(userInfo).token : '';

const axiosInstance = axios.create({
  baseURL: 'https://13.124.172.100.sslip.io',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false // SSL 인증서 검사 무시
  })
});

// 요청 인터셉터

axiosInstance.interceptors.request.use(
  config => {
    // 요청 전 수행할 로직 추가 가능 (예: 토큰 갱신)
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
