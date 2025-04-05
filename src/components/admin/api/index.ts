import { IContent } from '@/entities/program/type.dto';
import request from '@/shared/api/axiosInstance';
import { ICategory } from '@/shared/type';

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
interface ApiResponse {
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
export const getContentList = async (
  params: ContentListParams
): Promise<IContent[] | undefined> => {
  try {
    const res = await request<ApiResponse>({
      method: 'GET',
      url: 'api/admin/edu-content/list', // URL 수정 (category/list가 아닌 edu-content/list)
      params: {
        categoryId: params.categoryId,
        difficultyLevel: params.difficultyLevel,
        year: params.year,
        month: params.month,
        page: params.page || 0,
        size: params.size
      }
    });
    return res.data.data.content;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
