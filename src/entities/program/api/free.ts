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
import { IPlan } from '.';
import { FreeCountResponse } from '@/shared/stores';

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

// FreeCountResponse 타입은 shared/stores/freeCount.ts로 이동됨

const freeCount = async () => {
  try {
    const res = await request<ApiResponse<FreeCountResponse>>({
      method: 'GET',
      url: '/api/common/free-trial/print/count'
    });
    toast.success(res.data.message);
    return res.data.data;
  } catch (error: any) {
    console.error(error);
    toast.error(error.response.data.message);
    return undefined;
  }
};

const getFreeHistoryList = async (elderId: number) => {
  try {
    const res = await request<IRes<IPlan>>({
      method: 'GET',
      url: `/api/common/free-trial/plan/history/${elderId}`
    });
    toast.success(res.data.message);
    return res.data.data;
  } catch (error: any) {
    console.error(error);
    toast.error(error.response.data.message);
    return undefined;
  }
};

const getFreePlan = async (difficultyLevel: number) => {
  try {
    const res = await request<IRes<IPlan>>({
      method: 'GET',
      url: `/api/common/free-trial/plan/${difficultyLevel}`
    });
    toast.success(res.data.message);
    return res.data.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message);
    console.error(error);
    return undefined;
  }
};

const printFreeCalendar = async ({
  elderId,
  data
}: {
  elderId: number;
  data: {
    mainEduContentIds: number[][];
    year: number;
    month: number;
  };
}) => {
  try {
    const res = await request<Blob>({
      method: 'POST',
      url: '/api/common/free-trial/print/calendar',
      params: {
        elderId
      },
      data,
      headers: {
        Accept: 'application/pdf'
      },
      responseType: 'blob'
    });
    const blob = new Blob([res.data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    toast.success('스케줄 출력 성공');
    return url;
  } catch (error: any) {
    toast.error(error?.response?.data?.message);
    console.error('스케줄 출력 실패', error);
    return null;
  }
};

interface PrintFreePayload {
  noPrintDate: boolean;
  noPrintDailyChecklist: boolean;
  noPrintCalendar: boolean;
  mainEduContentIds: number[][];
}

const printFree = async (
  elderId: number,
  payload: PrintFreePayload
): Promise<string | null> => {
  try {
    const res = await request<Blob>({
      method: 'POST',
      url: `/api/common/free-trial/print?elderId=${elderId}`,
      data: payload,
      headers: {
        Accept: 'application/pdf'
      },
      responseType: 'blob'
    });

    const blob = new Blob([res.data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    return url;
  } catch (error) {
    console.error('📄 PDF 요청 실패:', error);
    return null;
  }
};

export {
  getFreeCategoryList,
  getFreeContentList,
  getElderFreeList,
  freeCount,
  getFreeHistoryList,
  getFreePlan,
  printFreeCalendar,
  printFree
};
