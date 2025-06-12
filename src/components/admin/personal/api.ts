import { ApiResponse, PaginatedResponse } from '@/shared/type';
import { IGetInquiryDetail, IInquiry } from './type';
import request from '@/shared/api/axiosInstance';

export const getInquiryList = async (
  page: number,
  limit: number,
  memberId: number | undefined
) => {
  try {
    const response = await request<ApiResponse<PaginatedResponse<IInquiry[]>>>({
      url: `/api/admin/inquiry/list`,
      method: 'GET',
      params: {
        page,
        limit,
        memberId: memberId || undefined
      }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const registerInquiryComment = async (
  inquiryId: number,
  comment: string,
  files: File[]
) => {
  try {
    const formData = new FormData();
    formData.append(
      'commentRegisterDTO',
      new Blob([JSON.stringify({ content: comment })], {
        type: 'application/json'
      })
    );

    if (files.length > 0) {
      files.forEach(file => {
        formData.append('files', file);
      });
    }

    const response = await request<ApiResponse<void>>({
      url: `/api/admin/inquiry/${inquiryId}/comment/register`,
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

export const deleteInquiryComment = async (
  inquiryId: number,
  commentId: number
) => {
  try {
    const response = await request<ApiResponse<void>>({
      url: `/api/admin/inquiry/${inquiryId}/comment/${commentId}`,
      method: 'DELETE'
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateInquiryComment = async (
  inquiryId: number,
  commentId: number,
  comment: string,
  files: File[],
  deletedFilesIdList: number[] = []
) => {
  try {
    const formData = new FormData();
    formData.append(
      'commentRegisterDTO',
      new Blob([JSON.stringify({ content: comment })], {
        type: 'application/json'
      })
    );

    files.forEach(file => {
      formData.append('addedFiles', file);
    });

    const params = new URLSearchParams();
    deletedFilesIdList.forEach(id => {
      params.append('deletedFilesIdList', id.toString());
    });

    const response = await request<ApiResponse<void>>({
      url: `/api/admin/inquiry/${inquiryId}/comment/${commentId}`,
      method: 'PUT',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params // ✅ 여기에서 직접 URLSearchParams 사용
    });

    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const getInquiryDetail = async (inquiryId: number) => {
  try {
    const response = await request<ApiResponse<IGetInquiryDetail>>({
      url: `/api/admin/inquiry/${inquiryId}`,
      method: 'GET'
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
