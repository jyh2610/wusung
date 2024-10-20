// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://13.124.172.100',
  headers: {
    'Content-Type': 'application/json'
  }
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

export default axiosInstance;
