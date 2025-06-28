import { create } from 'zustand';

// 개인회원 타입
export interface IndividualUserInfo {
  profilePictureUrl: string | null;
  username: string;
  id: string;
  name: string;
  birthOrEstablishmentDate: string;
  address: string;
  email: string;
  phoneNumber: string;
  UserType: '개인';
}

// 기업회원 타입
export interface CompanyUserInfo {
  profilePictureUrl: string | null;
  username: string;
  representativeName: string;
  companyName: string;
  corporateNumber: string;
  openingDate: string;
  address: string;
  detailAddress: string;
  email: string;
  phoneNumber: string;
  id: string;
  UserType: '법인' | '개인';
}

export type UserInfoStore =
  | (IndividualUserInfo & { setUserInfo: (info: IndividualUserInfo) => void })
  | (CompanyUserInfo & { setUserInfo: (info: CompanyUserInfo) => void });

export const useUserInfoStore = create<UserInfoStore>(set => ({
  // 기본값은 개인회원
  profilePictureUrl: null,
  username: '',
  id: '',
  name: '',
  birthOrEstablishmentDate: '',
  address: '',
  email: '',
  phoneNumber: '',
  UserType: '개인',
  setUserInfo: info => set({ ...info })
}));
