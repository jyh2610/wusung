'use client';

// import { useCategoryStore } from '@/shared/stores/useCategoryStore'; // 기존 스토어 import 제거
import { useCategoryTreeStore } from '@/shared/stores/useCategoryTreeStore'; // ✅ 새로운 스토어 import
import { CategoryNode } from '@/entities/program/type.dto'; // CategoryNode 타입 import
import React, { useEffect } from 'react';
import { listItem, selectedItem } from './index.css';
import { title } from '../../../index.css';

export function ActivityBox() {
  // ✅ 새로운 스토어에서 상태와 액션 가져오기
  const {
    categoryTree, // 이름 변경: categories -> categoryTree
    fetchCategoryTree, // 이름 변경: fetchCategories -> fetchCategoryTree
    selectedCategoryNode, // 이름 변경: selectedCategory -> selectedCategoryNode
    setSelectedCategoryNode // 이름 변경: setSelectedCategory -> setSelectedCategoryNode
  } = useCategoryTreeStore();

  // 데이터를 가져오는 useEffect (호출 함수 이름 변경)
  useEffect(() => {
    fetchCategoryTree(); // ✅ fetchCategoryTree 호출
  }, [fetchCategoryTree]);

  // 카테고리 선택 핸들러 (사용하는 상태/액션 이름 변경)
  const handleCategorySelect = (category: CategoryNode) => {
    setSelectedCategoryNode(category); // ✅ setSelectedCategoryNode 호출
  };

  return (
    <div>
      <h3 className={title} style={{ marginBottom: '32px' }}>
        활동지 목록
      </h3>
      <ul>
        {/* ✅ categoryTree 배열 순회 */}
        {categoryTree.map(item => (
          <li
            key={item.categoryId}
            onClick={() => handleCategorySelect(item)}
            className={`${listItem} ${
              // ✅ selectedCategoryNode와 비교
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
