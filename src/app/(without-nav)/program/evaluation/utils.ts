import { getDetailContent } from '@/entities/program/api';
import { CategoryNode, IContent } from '@/entities/program/type.dto';
import { findEvaluationCategories } from '@/lib/utils';

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
