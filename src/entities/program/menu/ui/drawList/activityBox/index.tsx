'use client';

import { ICategoryLeaf } from '@/entities/program/type.dto';
import { useCategoryStore } from '@/shared/stores/useCategoryStore';
import React, { useEffect } from 'react';
import { listItem, selectedItem } from './index.css';
import { title } from '../../../index.css';

export function ActivityBox() {
  const { categories, fetchCategories, selectedCategory, setSelectedCategory } =
    useCategoryStore();

  // 데이터를 가져오는 useEffect
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCategorySelect = (category: ICategoryLeaf) => {
    setSelectedCategory(category); // 카테고리 선택 시 상태 업데이트
  };

  return (
    <div>
      <h3 className={title} style={{ marginBottom: '32px' }}>
        활동지 목록
      </h3>
      <ul>
        {categories.map(item => (
          <li
            key={item.categoryId}
            onClick={() => handleCategorySelect(item)}
            className={`${listItem} ${
              selectedCategory?.categoryId === item.categoryId
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
