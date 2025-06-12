import { getCategoryTree, getUserCategoryTree } from '@/entities/program/api';
import { ICategoryLeaf } from '@/entities/program/type.dto';
import { create } from 'zustand';

interface CategoryStore {
  categories: ICategoryLeaf[];
  selectedCategory: ICategoryLeaf | null;
  fetchCategories: (isAdmin: boolean) => Promise<void>;
  setSelectedCategory: (category: ICategoryLeaf) => void;
}

export const useCategoryStore = create<CategoryStore>(set => ({
  categories: [],
  selectedCategory: null,

  fetchCategories: async (isAdmin: boolean) => {
    try {
      const res = isAdmin
        ? await getCategoryTree()
        : await getUserCategoryTree();
      if (res) {
        set({ categories: res });
      }
    } catch (error) {
      console.error('카테고리 불러오기 실패:', error);
    }
  },

  setSelectedCategory: (category: ICategoryLeaf) => {
    set({ selectedCategory: category });
  }
}));
