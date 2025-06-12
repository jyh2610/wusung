'use client';

// features/activity/lib/useActivityLogic.ts
import { useEffect, useState } from 'react';
import { useActivities } from '@/entities/program/scheduler/model/useActivities';
import { useCategoryStore } from '@/shared/stores/useCategoryStore';
import { useCategoryTreeStore } from '@/shared/stores/useCategoryTreeStore';
import { printUserPrint } from '@/entities/program/api';
import { toast } from 'react-toastify';

export function useActivityLogic() {
  const isAdmin = true;
  const [personName, setPersonName] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<'high' | 'medium' | 'low'>(
    'medium'
  );
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<Set<number>>(
    new Set()
  );

  const difficultyMap = { high: 1, medium: 2, low: 3 };

  const {
    categoryTree,
    fetchCategoryTree,
    selectedCategoryNode,
    setSelectedCategoryNode
  } = useCategoryTreeStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { activities, fetchActivities, setActivities } = useActivities({
    isAdmin,
    categoryId: categoryId ?? 0,
    difficultyLevel: difficultyMap[selectedLevel]
  });

  const handleCategoryChange = (event: { target: { value: any } }) => {
    const { value } = event.target;
    const newPersonName = typeof value === 'string' ? value.split(',') : value;
    setPersonName(newPersonName);
    const selectedCategory = categories?.find(n => n.name === newPersonName[0]);
    if (selectedCategory) {
      setCategoryId(selectedCategory.categoryId);
    }
  };

  const handleLevelClick = (
    level: (prevState: 'high' | 'medium' | 'low') => 'high' | 'medium' | 'low'
  ) => setSelectedLevel(level);

  const handleActivitySelect = (eduContentId: number) => {
    const newSelected = new Set(selectedActivities);
    newSelected.has(eduContentId)
      ? newSelected.delete(eduContentId)
      : newSelected.add(eduContentId);
    setSelectedActivities(newSelected);
  };

  const handleSelectAll = () => {
    if (activities?.length > 0) {
      const allIds = new Set(activities.map(a => a.eduContentId!));
      setSelectedActivities(allIds);
    }
  };

  const handleDeselectAll = () => setSelectedActivities(new Set());

  const handlePrint = async () => {
    try {
      const ids = Array.from(selectedActivities);
      if (ids.length === 0) return toast.warn('인쇄할 활동지를 선택해주세요.');
      const pdfUrl = await printUserPrint(ids);
      if (!pdfUrl) return toast.error('PDF 파일을 받지 못했습니다.');
      toast.info('PDF가 로딩되면 인쇄 대화 상자가 나타납니다.');

      const iframe = document.createElement('iframe');
      Object.assign(iframe.style, {
        position: 'fixed',
        right: '0',
        bottom: '0',
        width: '0',
        height: '0',
        border: 'none',
        visibility: 'hidden',
        pointerEvents: 'none'
      });
      iframe.src = pdfUrl;

      iframe.onload = () =>
        setTimeout(() => {
          try {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
          } catch (err) {
            toast.error('인쇄 대화 상자를 열 수 없습니다.');
            iframe.remove();
          }
        }, 500);

      iframe.onerror = () => {
        toast.error('PDF 로딩 중 오류가 발생했습니다.');
        iframe.remove();
      };

      document.body.appendChild(iframe);
    } catch (err) {
      console.error('프린트 에러:', err);
      toast.error('인쇄 실패되었습니다!');
    }
  };

  useEffect(() => {
    fetchCategories(isAdmin);
  }, [fetchCategories, isAdmin]);

  useEffect(() => {
    if (categories && categories.length > 0 && personName.length === 0) {
      const first = categories[0];
      setPersonName([first.name]);
      setCategoryId(first.categoryId);
    }
  }, [categories]);

  useEffect(() => {
    if (categoryId !== null) {
      fetchActivities().catch(err => {
        toast.error('활동지 불러오기에 실패했습니다.');
        setActivities([]);
      });
    }
  }, [categoryId, selectedLevel]);

  return {
    selectedCategoryNode,
    categories,
    personName,
    selectedLevel,
    activities,
    selectedActivities,
    handleCategoryChange,
    handleLevelClick,
    handleActivitySelect,
    handleSelectAll,
    handleDeselectAll,
    handlePrint
  };
}
