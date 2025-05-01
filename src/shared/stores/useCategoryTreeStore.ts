import { create } from 'zustand';
import { CategoryNode } from '@/entities/program/type.dto';
import { getUserCategoryTree } from '@/entities/program/api';

interface CategoryTreeState {
  categoryTree: CategoryNode[];
  selectedCategoryNode: CategoryNode | null;
  isLoading: boolean;
  error: Error | null;

  fetchCategoryTree: () => Promise<void>;
  setSelectedCategoryNode: (category: CategoryNode | null) => void;

  findLeafCategoriesByName: (name: string) => CategoryNode[]; // ✅ 추가된 메서드
}

export const useCategoryTreeStore = create<CategoryTreeState>(set => ({
  categoryTree: [],
  selectedCategoryNode: null,
  isLoading: false,
  error: null,

  fetchCategoryTree: async () => {
    set({ isLoading: true, error: null });
    try {
      const treeData = await getUserCategoryTree();
      const tree = treeData?.data || [];

      set({
        categoryTree: tree,
        selectedCategoryNode: tree.length > 0 ? tree[0] : null,
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
  },

  findLeafCategoriesByName: (name: string): CategoryNode[] => {
    const state = useCategoryTreeStore.getState();

    const collectLeafNodes = (nodes: CategoryNode[]): CategoryNode[] => {
      return nodes.flatMap(node => {
        if (!node.children || node.children.length === 0) {
          return [node];
        }
        return collectLeafNodes(node.children);
      });
    };

    const matchedRoots = state.categoryTree.filter(node => node.name === name);

    return matchedRoots.flatMap(root => collectLeafNodes([root]));
  }
}));
