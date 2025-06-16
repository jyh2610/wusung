import { IContent } from '@/entities/program/type.dto';
import request from '@/shared/api/axiosInstance';
import {
  ApiResponse,
  ICategory,
  ILeafCategory,
  PaginatedResponse
} from '@/shared/type';
import {
  IMemberDetail,
  IpList,
  Member,
  MemberListParams,
  PrintHistory,
  RegCategory
} from '../tpye';
import { message } from 'antd';
import { toast } from 'react-toastify';

interface CategoryResponse {
  data: ICategory[];
  message: string;
}

export const getCategoryList = async (): Promise<ICategory[] | undefined> => {
  try {
    const res = await request<CategoryResponse>({
      method: 'GET',
      url: 'api/admin/category/list'
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const getCategoryTree = async () => {
  try {
    const res = await request<ApiResponse<ILeafCategory[]>>({
      method: 'GET',
      url: '/api/admin/edu-content/category/tree'
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const regCategory = async (category: RegCategory) => {
  try {
    const res = await request<ApiResponse<null>>({
      method: 'POST',
      url: '/api/admin/category',
      data: category
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const updateCategory = async (
  categoryId: number,
  category: RegCategory
) => {
  try {
    const res = await request<ApiResponse<null>>({
      method: 'PUT',
      url: `/api/admin/category/${categoryId}`,
      data: category
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const deleteCategory = async (categoryId: number) => {
  try {
    const res = await request<ApiResponse<null>>({
      method: 'DELETE',
      url: `/api/admin/category/${categoryId}`
    });
    message.success('카테고리가 성공적으로 삭제되었습니다.');
    return res.data.data;
  } catch (error: any) {
    message.error(
      error.response?.data?.message || '카테고리 삭제 중 오류가 발생했습니다.'
    );
    return undefined;
  }
};

// 페이지네이션 정보 타입
interface PageInfo {
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

// 콘텐츠 목록 응답 타입
interface ContentListResponse {
  content: IContent[];
  pageable: PageInfo;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

// API 응답 전체 타입
interface IApiResponse {
  data: ContentListResponse;
  message: string;
}
interface ContentListParams {
  categoryId: number; // 카테고리 ID (필수)
  difficultyLevel: number; // 난이도 (필수)
  year?: number; // 년도 (선택)
  month?: number; // 월 (선택)
  page?: number; // 페이지 번호 (선택, 기본값 0)
  size?: number; // 페이지 크기 (선택)
}

// getContentList 함수의 수정된 타입
export const getContentList = async (params: ContentListParams) => {
  try {
    const res = await request<IApiResponse>({
      method: 'GET',
      url: '/api/admin/edu-content/list',
      params
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const getUserContentList = async ({
  categoryId,
  difficultyLevel
}: {
  categoryId: number;
  difficultyLevel: number;
}): Promise<IContent[] | undefined> => {
  try {
    const res = await request<IApiResponse>({
      method: 'GET',
      url: `/api/program/use/${categoryId}/${difficultyLevel}` // URL 수정 (category/list가 아닌 edu-content/list)
    });
    return res.data.data.content;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export interface Category {
  categoryId: number;
  parentId: number | null;
  name: string;
  isUsed: boolean;
  children: Category[];
}

export interface CategoryTreeResponse {
  data: Category[];
  message: string;
}

export const getMemberList = async (params: MemberListParams) => {
  try {
    const res = await request<ApiResponse<PaginatedResponse<Member>>>({
      method: 'GET',
      url: '/api/admin/member/list',
      params
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const getMemberSortList = async () => {
  try {
    const res = await request<ApiResponse<string[]>>({
      method: 'GET',
      url: '/api/admin/member/list/sort-columns'
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const getMemberDetail = async (memberId: number) => {
  try {
    const res = await request<ApiResponse<IMemberDetail>>({
      method: 'GET',
      url: `/api/admin/member/${memberId}`
    });
    return res.data.data;
  } catch (error) {
    return undefined;
  }
};

export const withdrawMember = async (memberId: number) => {
  try {
    const res = await request<ApiResponse<null>>({
      method: 'POST',
      url: `/api/admin/member/${memberId}/withdraw`
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const restoreMember = async (memberId: number) => {
  try {
    const res = await request<ApiResponse<null>>({
      method: 'POST',
      url: `/api/admin/member/${memberId}/restore`
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const changeSubscriptionEndDate = async ({
  memberId,
  newEndDate,
  isVip
}: {
  memberId: number;
  newEndDate: string;
  isVip: boolean;
}) => {
  try {
    const res = await request<ApiResponse<null>>({
      method: 'PUT',
      url: `/api/admin/member/${memberId}/subscription/end-date`,
      params: {
        newEndDate,
        isVip
      }
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const changePassword = async ({
  memberId,
  newPassword,
  confirmPassword
}: {
  memberId: number;
  newPassword: string;
  confirmPassword: string;
}) => {
  try {
    const res = await request<ApiResponse<null>>({
      method: 'PUT',
      url: `/api/admin/member/${memberId}/password`,
      params: { newPassword, confirmPassword }
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const getIpList = async (memberId: number, params: { page: number; size: number }) => {
  try {
    const res = await request<ApiResponse<PaginatedResponse<IpList>>>({
      method: 'GET',
      url: `/api/admin/member/${memberId}/ip-list`,
      params
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const deleteContent = async (contentId: number) => {
  try {
    const res = await request<ApiResponse<null>>({
      method: 'DELETE',
      url: `/api/admin/edu-content/${contentId}`
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const getPrintHistory = async (
  memberId: number,
  params: {
    page: number;
    size: number;
  }
) => {
  try {
    const res = await request<ApiResponse<PaginatedResponse<PrintHistory>>>({
      method: 'GET',
      url: `/api/admin/member/${memberId}/print-history`,
      params
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const deleteSchedule = async (scheduleId: number) => {
  try {
    const res = await request<ApiResponse<null>>({
      method: 'DELETE',
      url: `/api/admin/schedule/${scheduleId}`
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
export const controlCategory = async (categoryId: number, up: boolean) => {
  try {
    const res = await request<ApiResponse<null>>({
      method: 'PATCH',
      url: `/api/admin/category/${categoryId}/order`,
      data: { up }
    });
    toast.success('카테고리 순서가 성공적으로 변경되었습니다.');
    return res.data.data;
  } catch (error: any) {
    toast.error(
      error.response?.data?.message ||
        '카테고리 순서 변경 중 오류가 발생했습니다.'
    );
    return undefined;
  }
};
