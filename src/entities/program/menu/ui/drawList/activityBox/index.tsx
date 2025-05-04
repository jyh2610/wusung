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

  const children = useCategoryTreeStore(state => {
    return state.getChildrenOfRootByName(categoryName);
  });

  const handleCategorySelect = (category: CategoryNode) => {
    setSelectedCategoryNode(category);
  };
  useEffect(() => {
    if (children.length > 0) {
      setSelectedCategoryNode(children[0]); // 첫 번째 항목 자동 선택
    }
  }, [children, setSelectedCategoryNode]);

  return (
    <div>
      <h3 className={title} style={{ marginBottom: '32px' }}>
        {categoryName} 목록
      </h3>
      <ul>
        {children.map(item => (
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
  );
}
