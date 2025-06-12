import request from '@/shared/api/axiosInstance';
import { ApiResponse, PaginatedResponse } from '@/shared/type';
import {
  IDashboard,
  DashboardDetail,
  RegDashboard,
  ResponseFile
} from '../type';

export const getDashboard = async () => {
  try {
    const res = await request<ApiResponse<PaginatedResponse<IDashboard>>>({
      method: 'GET',
      url: '/api/admin/announcement/list'
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const regDashboard = async (dashboard: RegDashboard) => {
  try {
    const formData = new FormData();

    const announcementDTO = {
      title: dashboard.title,
      content: dashboard.content,
      topExposure: dashboard.topExposure,
      topExposureTag: dashboard.topExposureTag,
      isVisible: dashboard.isVisible
    };
    formData.append('announcementDTO', JSON.stringify(announcementDTO));

    if (dashboard.files && dashboard.files.length > 0) {
      dashboard.files.forEach((file, index) => {
        formData.append('files', file);
      });
    }

    const res = await request<ApiResponse<null>>({
      method: 'POST',
      url: '/api/admin/announcement/register',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const uploaContent = async (files: File[]) => {
  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('file', file);
    });
    const res = await request<ApiResponse<ResponseFile>>({
      method: 'POST',
      url: '/api/admin/announcement/file',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const getDashboardDetail = async (announcementId: number) => {
  try {
    const res = await request<ApiResponse<DashboardDetail>>({
      method: 'GET',
      url: `/api/admin/announcement/${announcementId}`
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const updateDashboard = async (
  announcementId: number,
  formData: FormData
) => {
  try {
    const res = await request<ApiResponse<DashboardDetail>>({
      method: 'PUT',
      url: `/api/admin/announcement/${announcementId}`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteDashboard = async (announcementId: number) => {
  try {
    const res = await request<ApiResponse<null>>({
      method: 'DELETE',
      url: `/api/admin/announcement/${announcementId}`
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
