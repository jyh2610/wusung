import { ApiResponse, PaginatedResponse } from '@/shared/type';
import { IPopup, IRegPopup, ResponseFile } from '../tpye';
import request from '@/shared/api/axiosInstance';

export const regPopup = async (popup: IRegPopup) => {
  try {
    const response = await request<ApiResponse<IPopup>>({
      method: 'POST',
      url: '/api/admin/popup/register',
      data: popup
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const updatePopup = async (popupId: number, popup: IRegPopup) => {
  try {
    const response = await request<ApiResponse<IPopup>>({
      method: 'PUT',
      url: `/api/admin/popup/update/${popupId}`,
      data: popup
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const regPopupFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await request<ApiResponse<ResponseFile>>({
      method: 'POST',
      url: '/api/admin/popup/file',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const getPopup = async (page: number, size: number) => {
  try {
    const response = await request<ApiResponse<PaginatedResponse<IPopup>>>({
      method: 'GET',
      url: `/api/admin/popup/list?page=${page}&size=${size}`
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const deletePopup = async (popupId: number) => {
  try {
    const response = await request<ApiResponse<unknown>>({
      method: 'DELETE',
      url: `/api/admin/popup/delete/${popupId}`
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
