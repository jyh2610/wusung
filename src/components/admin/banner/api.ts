import request from '@/shared/api/axiosInstance';
import { ApiResponse, PaginatedResponse } from '@/shared/type';
import { toast } from 'react-toastify';
import {
  IMainBannerResponse,
  IBannerResponse,
  IBannerRegisterDTO,
  BannerCategory
} from './type';

export const getBannerList = async () => {
  try {
    const res = await request<ApiResponse<PaginatedResponse<IBannerResponse>>>({
      method: 'GET',
      url: '/api/admin/banner'
    });
    return res.data;
  } catch (error: any) {
    console.error(error);
    toast.error(error.response.data.message);
    return null;
  }
};

export const getBannerDetail = async (id: string) => {
  try {
    const res = await request<ApiResponse<IBannerResponse>>({
      method: 'GET',
      url: `/api/admin/banner/${id}`
    });
    toast.success(res.data.message);
    return res.data;
  } catch (error: any) {
    console.error(error);
    toast.error(error.response.data.message);
    return null;
  }
};

export const createBanner = async (data: IBannerRegisterDTO, image: File[]) => {
  try {
    const formData = new FormData();
    formData.append('bannerRegisterDTO', JSON.stringify(data));
    image.forEach(img => formData.append('image', img));

    const res = await request<ApiResponse<IMainBannerResponse>>({
      method: 'POST',
      url: '/api/admin/banner',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    toast.success(res.data.message);
    return res.data;
  } catch (error: any) {
    console.error(error);
    toast.error(error.response.data.message);
    return null;
  }
};

export const updateBanner = async (
  id: string,
  data: IBannerRegisterDTO,
  image: File[]
) => {
  try {
    const formData = new FormData();
    formData.append('bannerRegisterDTO', JSON.stringify(data));
    image.forEach(img => formData.append('image', img));

    const res = await request<ApiResponse<IMainBannerResponse>>({
      method: 'PUT',
      url: `/api/admin/banner/${id}`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    toast.success(res.data.message);
    return res.data;
  } catch (error: any) {
    console.error(error);
    toast.error(error.response.data.message);
    return null;
  }
};

export const deleteBanner = async (id: string) => {
  try {
    const res = await request<ApiResponse<IMainBannerResponse>>({
      method: 'DELETE',
      url: `/api/admin/banner/${id}`
    });
    toast.success(res.data.message);
    return res.data;
  } catch (error: any) {
    console.error(error);
    toast.error(error.response.data.message);
    return null;
  }
};
export const getBannerCategory = async () => {
  try {
    const res = await request<ApiResponse<BannerCategory[]>>({
      method: 'GET',
      url: '/api/admin/banner/categories'
    });
    return res.data;
  } catch (error: any) {
    console.error(error);
    return null;
  }
};
