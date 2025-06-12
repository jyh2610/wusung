import { create } from 'zustand';
import { CategoryNode, ICategoryLeaf } from '@/entities/program/type.dto';
import { getCategoryIndividualList, getUserCategoryTree } from '@/entities/program/api';

interface CategoryTreeState {
  categoryTree: CategoryNode[];
  categoryIndividualList: ICategoryLeaf[];
  selectedCategoryNode: CategoryNode | null;
  isLoading: boolean;
  error: Error | null;

  fetchCategoryIndividualList: () => Promise<void>;
  fetchCategoryTree: () => Promise<void>;
  setSelectedCategoryNode: (category: CategoryNode | null) => void;

  findLeafCategoriesByName: (name: string) => CategoryNode[];
  getChildrenOfRootByName: (name: string) => CategoryNode[];
}

export const useCategoryTreeStore = create<CategoryTreeState>(set => ({
  categoryTree: [],
  categoryIndividualList: [],
  selectedCategoryNode: null,
  isLoading: false,
  error: null,

  getChildrenOfRootByName: (name: string): CategoryNode[] => {
    const state = useCategoryTreeStore.getState();
    console.log('Searching for category:', name);
    console.log('Available categories:', state.categoryTree);

    const categoryMapping: Record<string, string> = {
      '개별 활동지': '활동지',
      평가자료: '평가자료',
      기타자료: '기타자료'
    };

    const mappedName = categoryMapping[name] || name;
    const root = state.categoryTree.find(node => node.name === mappedName);
    console.log('Found root:', root);
    return root?.children || [];
  },

  fetchCategoryIndividualList: async () => {
    set({ isLoading: true, error: null });
    try {
      const treeData = await getCategoryIndividualList();
      console.log(treeData);
      set({
        categoryIndividualList: treeData,
        isLoading: false
      });
    }
    catch (err) {
      console.error('Failed to fetch category individual list:', err);
      set({ 
        error: err instanceof Error ? err : new Error('Unknown error'),
        isLoading: false
      });
    }
  },

  fetchCategoryTree: async () => {
    set({ isLoading: true, error: null });
    try {
      const treeData = await getUserCategoryTree();
      // Corrected line: Directly use treeData as it's the array
      const tree = treeData || [];

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
