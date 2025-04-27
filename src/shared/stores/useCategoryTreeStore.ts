import { create } from 'zustand';
import { CategoryNode } from '@/entities/program/type.dto'; // CategoryNode 타입 정의
import { getUserCategoryTree } from '@/entities/program/api'; // API 호출 함수

interface CategoryTreeState {
  categoryTree: CategoryNode[]; // 전체 카테고리 트리
  selectedCategoryNode: CategoryNode | null; // 선택된 카테고리 노드
  isLoading: boolean; // 로딩 여부
  error: Error | null; // 에러 여부

  fetchCategoryTree: () => Promise<void>; // 카테고리 트리 가져오기
  setSelectedCategoryNode: (category: CategoryNode | null) => void; // 선택 노드 설정
}

export const useCategoryTreeStore = create<CategoryTreeState>(set => ({
  categoryTree: [],
  selectedCategoryNode: null,
  isLoading: false,
  error: null,

  fetchCategoryTree: async () => {
    set({ isLoading: true, error: null });
    try {
      const treeData = await getUserCategoryTree(); // ✅ 트리 가져오기
      const tree = treeData?.data || []; // 결과 없으면 빈 배열

      set({
        categoryTree: tree,
        selectedCategoryNode: tree.length > 0 ? tree[0] : null, // ✅ 첫 번째 항목 자동 선택
        isLoading: false
      });
    } catch (err) {
      console.error('Failed to fetch category tree:', err);
      set({
        error: err instanceof Error ? err : new Error('Unknown error'),
        isLoading: false
      });
    }
  },

  setSelectedCategoryNode: category => {
    set({ selectedCategoryNode: category });
  }
}));
