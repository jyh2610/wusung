import { create } from 'zustand';
import { login, login_code, logout } from '@/entities/MainBanner/api';
import { getSubscription } from '@/entities/UserManage/api';
import { syncTokenFromLocalStorage } from '@/lib/utils';

interface AuthState {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  endDate: string | null;
  isVip: boolean;
  requires2FA: boolean;
  isHydrated: boolean;
  tempUser: { id: string; password: string } | null;

  login: (id: string, password: string) => Promise<boolean>;
  submit2FACode: (code: string) => Promise<boolean>;
  set2FAState: (
    state: boolean,
    user?: { id: string; password: string } | null
  ) => void;
  logout: () => void;
  checkAuthentication: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  username: null,
  isAuthenticated: false,
  endDate: null,
  isVip: false,
  requires2FA: false,
  tempUser: null,
  isHydrated: false,

  login: async (id, password) => {
    try {
      const res = await login({ userName: id, password });
      const userSub = await getSubscription(res.accessToken);

      localStorage.setItem(
        'userInfo',
        JSON.stringify({
          token: res.accessToken,
          username: res.username,
          endDate: userSub?.data.endDate,
          isVip: userSub?.data.isVip
        })
      );

      syncTokenFromLocalStorage();

      set({
        token: res.accessToken,
        username: res.username,
        endDate: userSub?.data.endDate,
        isVip: userSub?.data.isVip,
        isAuthenticated: true,
        requires2FA: false,
        tempUser: null
      });

      return true;
    } catch (error: any) {
      const errorRes = error?.response?.data;
      if (errorRes?.requires2FA) {
        set({
          requires2FA: true,
          tempUser: { id, password }
        });
      } else {
        console.error('로그인 실패:', error);
        set({ isAuthenticated: false });
      }
      return false;
    }
  },

  submit2FACode: async (code: string) => {
    const tempUser = get().tempUser;
    if (!tempUser) return false;

    try {
      const res = await login_code({
        userName: tempUser.id,
        password: tempUser.password,
        code
      });

      const userSub = await getSubscription(res.accessToken);

      localStorage.setItem(
        'userInfo',
        JSON.stringify({
          token: res.accessToken,
          username: res.username,
          endDate: userSub?.data.endDate,
          isVip: userSub?.data.isVip
        })
      );

      syncTokenFromLocalStorage();

      set({
        token: res.accessToken,
        username: res.username,
        endDate: userSub?.data.endDate,
        isVip: userSub?.data.isVip,
        isAuthenticated: true,
        requires2FA: false,
        tempUser: null
      });

      return true;
    } catch (error) {
      console.error('2차 인증 실패:', error);
      return false;
    }
  },

  set2FAState: (state, user = null) => {
    set({
      requires2FA: state,
      tempUser: user ?? null
    });
  },

  logout: async () => {
    await logout();

    localStorage.removeItem('userInfo');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie =
      'username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';

    set({
      token: null,
      username: null,
      isAuthenticated: false,
      endDate: null,
      isVip: false,
      requires2FA: false,
      tempUser: null
    });
  },

  checkAuthentication: () => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      set({
        token: parsed.token,
        username: parsed.username,
        endDate: parsed.endDate,
        isVip: parsed.isVip,
        isAuthenticated: true,
        isHydrated: true
      });

      syncTokenFromLocalStorage();
    }
  }
}));
