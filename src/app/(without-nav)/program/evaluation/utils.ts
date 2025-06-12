import { getDetailContent } from '@/entities/program/api';
import { CategoryNode, IContent, IContentList } from '@/entities/program/type.dto';
import { findEvaluationCategories } from '@/lib/utils';
import request from '@/shared/api/axiosInstance';
import { ApiResponse, PaginatedResponse } from '@/shared/type';

export const fetchEvaluationContentsOnly = async (
  categoryTree: CategoryNode[]
): Promise<IContent[]> => {
  const evalCategories = findEvaluationCategories(categoryTree);

  const fetchPromises = evalCategories.map(async category => {
    try {
      const res = await getDetailContent(category.categoryId);
      const contents = (res || []) as IContent[];
      return contents;
    } catch (error) {
      console.error(
        `❌ Failed to fetch content for category ${category.categoryId}`,
        error
      );
      return [];
    }
  });

  const results = await Promise.all(fetchPromises);

  // ✅ 2차원 배열을 1차원 배열로 평탄화하여 리턴
  return results.flat();
};

export const getContentList = async ({categoryId, difficultyLevel,page,size}:{categoryId:number, difficultyLevel:number,page:number,size:number}) => {
  const res = await request<ApiResponse<PaginatedResponse<IContentList[]>>>({
    method: 'GET',
    url: `/api/program/use/${categoryId}/${difficultyLevel}`,
    params: {
      page,
      size    
    } 
  });
  return res;
};