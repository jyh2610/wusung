import { create } from 'zustand';
import { CategoryNode } from '@/entities/program/type.dto'; // CategoryNode 타입 정의 경로 확인
import { getUserCategoryTree } from '@/entities/program/api'; // API 함수 경로 확인

// 스토어 상태 및 액션 인터페이스 정의
interface CategoryTreeState {
  categoryTree: CategoryNode[]; // 전체 카테고리 트리 데이터 (최상위 노드 배열)
  selectedCategoryNode: CategoryNode | null; // 현재 선택된 카테고리 노드
  isLoading: boolean; // 데이터 로딩 상태
  error: Error | null; // 데이터 로딩 에러 상태
  fetchCategoryTree: () => Promise<void>; // 트리 데이터 가져오는 액션
  setSelectedCategoryNode: (category: CategoryNode | null) => void; // 선택된 노드 설정 액션
}

// Zustand 스토어 생성
export const useCategoryTreeStore = create<CategoryTreeState>(set => ({
  // 초기 상태
  categoryTree: [],
  selectedCategoryNode: null,
  isLoading: false,
  error: null,

  // 액션: 카테고리 트리 데이터 가져오기
  fetchCategoryTree: async () => {
    set({ isLoading: true, error: null }); // 로딩 시작, 에러 초기화
    try {
      const treeData = await getUserCategoryTree(); // API 호출
      set({
        categoryTree: treeData || [], // 성공 시 데이터 설정 (undefined면 빈 배열)
        isLoading: false
      });
    } catch (err) {
      console.error('Failed to fetch category tree:', err);
      set({
        error: err instanceof Error ? err : new Error('Unknown error'),
        isLoading: false
      }); // 에러 설정, 로딩 종료
    }
  },

  // 액션: 선택된 카테고리 노드 설정
  setSelectedCategoryNode: category => {
    set({ selectedCategoryNode: category }); // selectedCategoryNode 상태 업데이트
  }
}));
