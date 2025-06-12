import request from '@/shared/api/axiosInstance';
import { IFamily } from './type';
import { ApiResponse, PaginatedResponse } from '@/shared/type';

export const getFamilyList = async (page: number, limit: number) => {
  try {
    const response = await request<ApiResponse<PaginatedResponse<IFamily[]>>>({
      url: `/api/admin/partner/list`,
      method: 'GET',
      params: {
        page,
        limit
      }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const registerFamily = async (data: IFamily, file: File) => {
  try {
    const formData = new FormData();
    formData.append(
      'partnerDTO',
      JSON.stringify({
        name: data.name,
        description: data.description,
        link: data.link,
        isVisible: data.isVisible
      })
    );
    formData.append('file', file);

    const response = await request<ApiResponse<IFamily>>({
      url: `/api/admin/partner/register`,
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteFamily = async (id: number) => {
  try {
    const response = await request<ApiResponse<void>>({
      url: `/api/admin/partner/${id}`,
      method: 'DELETE'
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateFamily = async (id: number, data: IFamily, file?: File) => {
  try {
    const formData = new FormData();
    formData.append(
      'partnerDTO',
      JSON.stringify({
        name: data.name,
        description: data.description,
        link: data.link,
        isVisible: data.isVisible
      })
    );

    if (file) {
      formData.append('file', file);
    }

    const response = await request<ApiResponse<IFamily>>({
      url: `/api/admin/partner/${id}`,
      method: 'PUT',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
