import { getCategoryLeaf, getUserCategoryTree } from '@/entities/program/api';
import { ICategoryLeaf } from '@/entities/program/type.dto';
import { create } from 'zustand';

interface CategoryStore {
  categories: ICategoryLeaf[];
  selectedCategory: ICategoryLeaf | null; // 선택된 카테고리 상태 추가
  fetchCategories: (isAdmin: boolean) => Promise<void>;
  setSelectedCategory: (category: ICategoryLeaf) => void; // 카테고리 선택 함수 추가
}

export const useCategoryStore = create<CategoryStore>(set => ({
  categories: [],
  selectedCategory: null, // 초기값 null로 설정

  fetchCategories: async (isAdmin: boolean) => {
    try {
      const res = isAdmin
        ? await getCategoryLeaf()
        : await getUserCategoryTree().then(res => res?.leafList);
      set({ categories: res });
    } catch (error) {
      console.error('카테고리 불러오기 실패:', error);
    }
  },

  setSelectedCategory: (category: ICategoryLeaf) => {
    set({ selectedCategory: category });
  }
}));
