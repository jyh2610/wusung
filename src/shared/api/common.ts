import { NextResponse } from 'next/server';
import request from './axiosInstance';
import { ApiResponse, PaginatedResponse } from '../type';

export interface roleResDTO {
  data: 'ADMIN' | 'USER' | 'UNKNOWN';
  message: string;
}

export async function getRole(
  token: string | null
): Promise<roleResDTO | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/common/main/access-role`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        cache: 'no-store'
      }
    );

    if (!res.ok) {
      console.error('권한 조회 실패:', res.status);
      return null;
    }

    const data = (await res.json()) as roleResDTO;
    return data;
  } catch (error) {
    console.error('fetch 실패:', error);
    return null;
  }
}

export interface IAnnouncementResponse {
  announcementId: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  topExposure: boolean;
  topExposureTag: string;
  files: null | Array<{
    fileId: number;
    fileName: string;
    fileUrl: string;
  }>;
  views: number;
}

export interface IPopupResponse {
  popupId: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface IPartResponse {
  partId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const getAnnouncementList = async ({
  page,
  size
}: {
  page: number;
  size: number;
}) => {
  const res = request<ApiResponse<PaginatedResponse<IAnnouncementResponse>>>({
    method: 'GET',
    url: '/api/common/main/announcement/list',
    params: {
      page: page,
      size: size
    }
  });
  return res;
};

export const getAnnouncementDetail = async (announcementId: number) => {
  const res = request<ApiResponse<IAnnouncementResponse>>({
    method: 'GET',
    url: `/api/announcement/${announcementId}`
  });
  return res;
};

export const popupList = async () => {
  const res = request<ApiResponse<IPopupResponse[]>>({
    method: 'GET',
    url: '/api/common/main/popup/list'
  });
  return res;
};

export const partList = async () => {
  const res = request<ApiResponse<IPartResponse>>({
    method: 'GET',
    url: '/api/common/main/part/list'
  });
  return res;
};

interface IPartnerResponse {
  partnerId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const getPartnerList = async () => {
  const res = await request<ApiResponse<IPartnerResponse>>({
    method: 'GET',
    url: '/api/common/main/partner/list'
  });
  return res;
};

export const getFAQList = async () => {
  try {
    const res = await request<
      ApiResponse<PaginatedResponse<IAnnouncementResponse>>
    >({
      method: 'GET',
      url: '/api/inquiry/faq'
    });
    return res.data.data;
  } catch (error) {
    console.error('FAQ 목록 조회 실패:', error);
  }
};
