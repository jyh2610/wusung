import { getCategoryTree, getUserCategoryTree } from '@/entities/program/api';
import { getFreeCategoryList } from '@/entities/program/api/free';
import { ICategoryLeaf } from '@/entities/program/type.dto';
import { create } from 'zustand';

interface CategoryStore {
  categories: ICategoryLeaf[];
  selectedCategory: ICategoryLeaf | null;
  fetchCategories: (isAdmin: boolean, isFree: boolean) => Promise<void>;
  setSelectedCategory: (category: ICategoryLeaf) => void;
}

export const useCategoryStore = create<CategoryStore>(set => ({
  categories: [],
  selectedCategory: null,

  fetchCategories: async (isAdmin: boolean, isFree: boolean) => {
    try {
      const res = isFree
        ? await getFreeCategoryList()
        : isAdmin
          ? await getCategoryTree()
          : await getUserCategoryTree();

      if (res && Array.isArray(res)) {
        set({ categories: res });
      } else {
        // 응답이 없거나 배열이 아닌 경우 빈 배열로 설정
        set({ categories: [] });
      }
    } catch (error) {
      console.error('카테고리 불러오기 실패:', error);
      // 오류 발생 시에도 빈 배열로 설정
      set({ categories: [] });
    }
  },

  setSelectedCategory: (category: ICategoryLeaf) => {
    set({ selectedCategory: category });
  }
}));
