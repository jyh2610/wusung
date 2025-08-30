import request from '@/shared/api/axiosInstance';
import {
  CategoryNode,
  CategoryResponse,
  ICategoryLeaf,
  IContent,
  IRegUser,
  IUser,
  IUserDetail
} from '../type.dto';
import { ApiResponse, EduContent, IRes } from '@/shared/type';
import { extractLeafNodes, getlocalStorageValue } from '@/lib/utils';
import { toast } from 'react-toastify';
import { ContentListResponse } from '@/components/admin/api';

const getFreeCategoryList = async (): Promise<CategoryResponse> => {
  try {
    const res = await request<ApiResponse<any>>({
      method: 'GET',
      url: '/api/common/free-trial/category/tree'
    });

    // 무료 버전은 단일 객체로 응답이 오므로 배열로 변환
    const data = res.data.data;
    if (data && !Array.isArray(data)) {
      // 단일 객체를 배열로 변환
      return [data] as CategoryResponse;
    }

    // 이미 배열인 경우 그대로 반환
    return data as CategoryResponse;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getFreeContentList = async (
  difficultyLevel: number,
  page: number = 0,
  size: number = 15
): Promise<ContentListResponse | undefined> => {
  try {
    const res = await request<ApiResponse<ContentListResponse>>({
      method: 'GET',
      url: `/api/common/free-trial/content/${difficultyLevel}`,
      params: {
        page,
        size
      }
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
  }
};

const getElderFreeList = async () => {
  try {
    const res = await request<IRes<IUser[]>>({
      method: 'GET',
      url: '/api/common/free-trial/elder/list'
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const freeCount = async () => {
  try {
    const res = await request<ApiResponse<number>>({
      method: 'GET',
      url: '/api/common/free-trial/print/count'
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

const getHistoryList = async (elderId: number) => {
  try {
    const res = await request<ApiResponse<ContentListResponse>>({
      method: 'GET',
      url: `/api/common/free-trial/plan/history/${elderId}`
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

const getFreePlan = async (difficultyLevel: number) => {
  try {
    const res = await request<ApiResponse<ContentListResponse>>({
      method: 'GET',
      url: `/api/common/free-trial/plan/${difficultyLevel}`
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

const printFreeCalendar = async ({
  elderId,
  data
}: {
  elderId: number;
  data: object;
}) => {
  try {
    const res = await request<ApiResponse<ContentListResponse>>({
      method: 'POST',
      url: '/api/common/free-trial/print/calendar',
      params: {
        elderId
      },
      data
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

const printFree = async ({
  elderId,
  data
}: {
  elderId: number;
  data: object;
}) => {
  try {
    const res = await request<ApiResponse<ContentListResponse>>({
      method: 'POST',
      url: '/api/common/free-trial/print',
      params: {
        elderId
      },
      data
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export {
  getFreeCategoryList,
  getFreeContentList,
  getElderFreeList,
  freeCount,
  getHistoryList,
  getFreePlan,
  printFreeCalendar,
  printFree
};
