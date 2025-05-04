import { create } from 'zustand';
import { login, logout } from '@/entities/MainBanner/api';

interface AuthState {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (id: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuthentication: () => void; // 로그인 상태 확인 함수
}

export const useAuthStore = create<AuthState>(set => ({
  token: null,
  username: null,
  isAuthenticated: false,

  // 로그인 처리
  login: async (id: string, password: string) => {
    try {
      const res = await login({ userName: id, password });
      console.log(res);

      // 로그인 성공 시 로컬 스토리지에 정보 저장
      localStorage.setItem(
        'userInfo',
        JSON.stringify({
          token: res.accessToken,
          username: res.username
        })
      );

      // 상태 업데이트
      set({
        token: res.accessToken,
        username: res.username,
        isAuthenticated: true
      });
    } catch (error) {
      console.error('로그인 실패:', error);
      set({ isAuthenticated: false });
    }
  },

  // 로그아웃 처리
  logout: async () => {
    await logout();
    localStorage.removeItem('userInfo');
    set({ token: null, username: null, isAuthenticated: false });
  },

  // 로그인 상태 확인 (앱 로드 시 자동 호출)
  checkAuthentication: () => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      set({
        token: parsedUserInfo.token,
        username: parsedUserInfo.username,
        isAuthenticated: true
      });
    }
  }
}));
