'use client';

import { useCategoryTreeStore } from '@/shared/stores/useCategoryTreeStore';
import { CategoryNode } from '@/entities/program/type.dto';
import React, { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { listItem, selectedItem } from './index.css';
import { title } from '../../../index.css';

const endpointMapper: Record<string, string> = {
  evaluation: '평가자료',
  etc: '기타자료',
  activity: '개별 활동지'
};

export function ActivityBox() {
  const pathname = usePathname();
  const endpoint = pathname.split('/').pop() || '';
  const categoryName = endpointMapper[endpoint];

  const {
    categoryIndividualList,
    categoryTree,
    fetchCategoryIndividualList,
    fetchCategoryTree,
    selectedCategoryNode,
    setSelectedCategoryNode,
    findLeafCategoriesByName,
    getChildrenOfRootByName
  } = useCategoryTreeStore();

  useEffect(() => {
    fetchCategoryIndividualList();
  }, [fetchCategoryIndividualList]);

  // 모든 최상위 카테고리 가져오기
  const rootCategories = useCategoryTreeStore(
    state => state.categoryIndividualList
  );

  // 엔드포인트가 evaluation일 때 평가자료 카테고리만 필터링
  const filteredCategories = useMemo(() => {
    if (endpoint === 'evaluation') {
      return rootCategories.filter(category => category.name === '평가자료');
    }
    if (endpoint === 'etc') {
      return rootCategories.filter(category => category.name === '기타자료');
    }
    if (endpoint === 'activity') {
      return rootCategories.filter(category => category.name === '활동지');
    }
    return rootCategories;
  }, [rootCategories, endpoint]);

  console.log('Category Tree:', categoryIndividualList);
  console.log('Root Categories:', rootCategories);

  const handleCategorySelect = (category: CategoryNode) => {
    setSelectedCategoryNode(category);
  };

  useEffect(() => {
    if (rootCategories.length > 0) {
      setSelectedCategoryNode(rootCategories[0]); // 첫 번째 항목 자동 선택
    }
  }, [rootCategories, setSelectedCategoryNode]);

  return (
    <div>
      <h3 className={title} style={{ marginBottom: '32px' }}>
        카테고리 목록
      </h3>
      <div className="space-y-6">
        {filteredCategories.map(rootCategory => (
          <div key={rootCategory.categoryId} className="mb-4">
            <h4 className="font-medium text-lg mb-2">{rootCategory.name}</h4>
            <ul>
              {rootCategory.children.map(item => (
                <li
                  key={item.categoryId}
                  onClick={() => handleCategorySelect(item)}
                  className={`${listItem} ${
                    selectedCategoryNode?.categoryId === item.categoryId
                      ? selectedItem
                      : ''
                  }`}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
