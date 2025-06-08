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
    categoryTree,
    fetchCategoryTree,
    selectedCategoryNode,
    setSelectedCategoryNode,
    findLeafCategoriesByName,
    getChildrenOfRootByName
  } = useCategoryTreeStore();

  useEffect(() => {
    fetchCategoryTree();
  }, [fetchCategoryTree]);

  // 모든 최상위 카테고리 가져오기
  const rootCategories = useCategoryTreeStore(state => state.categoryTree);

  console.log('Category Tree:', categoryTree);
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
        {rootCategories.map(rootCategory => (
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
