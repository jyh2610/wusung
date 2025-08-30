import { useEffect, useState } from 'react';
import {
  Select,
  MenuItem,
  OutlinedInput,
  SelectChangeEvent
} from '@mui/material';
import { colors } from '@/design-tokens';
import { useCategoryStore } from '@/shared/stores/useCategoryStore';
import { Droppable } from '@hello-pangea/dnd';
import { Activity } from './Activity';
import {
  activityListContainer,
  difficultyBox,
  titleContainer
} from './index.css';
import { IContent } from '../type.dto';
import { CustomCascader } from '@/shared/ui/cascader';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const difficultyMap = {
  high: 1,
  medium: 2,
  low: 3
};

interface IProps {
  activities: IContent[];
  onFilterChange: (
    categoryId: number,
    difficultyLevel: number,
    page?: number,
    size?: number
  ) => void;
  isAdmin: boolean;
  isFree: boolean;
  totalElements?: number;
  totalPages?: number;
  currentPage?: number;
  pageSize?: number;
}

export function ActivityList({
  activities,
  onFilterChange,
  isAdmin,
  isFree,
  totalElements = 0,
  totalPages = 0,
  currentPage = 1,
  pageSize = 15
}: IProps) {
  const [selectedLevel, setSelectedLevel] = useState<'high' | 'medium' | 'low'>(
    'medium'
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(15);

  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories(isAdmin, isFree);
  }, [fetchCategories]);

  // ✅ 카테고리 불러온 후 첫 번째 항목 자동 선택
  useEffect(() => {
    if (
      Array.isArray(categories) &&
      categories.length > 0 &&
      !selectedCategoryId
    ) {
      const firstCategory = categories[0];
      setSelectedCategoryId(firstCategory.categoryId);
      onFilterChange(
        firstCategory.categoryId,
        difficultyMap[selectedLevel],
        page,
        size
      );
    }
  }, [
    categories,
    selectedLevel,
    page,
    size,
    selectedCategoryId,
    onFilterChange
  ]);

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  };

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setPage(1); // 카테고리 변경 시 첫 페이지로 이동
    onFilterChange(categoryId, difficultyMap[selectedLevel], 1, size);
  };

  const handleLevelClick = (level: 'high' | 'medium' | 'low') => {
    console.log(
      'ActivityList - Level clicked:',
      level,
      'Current selectedLevel:',
      selectedLevel
    );
    console.log('ActivityList - selectedCategoryId:', selectedCategoryId);
    console.log('ActivityList - difficultyMap[level]:', difficultyMap[level]);

    setSelectedLevel(level);
    setPage(1); // 난이도 변경 시 첫 페이지로 이동
    if (selectedCategoryId) {
      onFilterChange(selectedCategoryId, difficultyMap[level], 1, size);
    } else {
      console.log(
        'ActivityList - selectedCategoryId is null, not calling onFilterChange'
      );
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    if (selectedCategoryId) {
      onFilterChange(
        selectedCategoryId,
        difficultyMap[selectedLevel],
        newPage,
        size
      );
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setSize(newSize);
    setPage(1); // 페이지 크기 변경 시 첫 페이지로 이동
    if (selectedCategoryId) {
      onFilterChange(
        selectedCategoryId,
        difficultyMap[selectedLevel],
        1,
        newSize
      );
    }
  };

  // 페이지네이션 번호 생성
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (page >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = page - 2; i <= page + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  // 페이지네이션 계산
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;

  return (
    <div
      style={{
        backgroundColor: colors.gray_scale['default'],
        borderRadius: '20px',
        padding: '24px',
        width: '100%'
      }}
    >
      <div className={titleContainer}>
        <span
          style={{
            fontSize: '32px',
            fontWeight: 600,
            color: colors.gray_scale[900]
          }}
        >
          인지활동지 목록
        </span>
        <div>
          <CustomCascader
            options={Array.isArray(categories) ? categories : []}
            value={selectedCategoryId ? [selectedCategoryId] : undefined}
            onChange={value => {
              if (value && value.length > 0) {
                handleCategoryChange(value[value.length - 1]);
              }
            }}
            placeholder="카테고리 선택"
            style={{ width: '240px' }}
          />
        </div>
      </div>

      {/* 난이도 선택 */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {(['high', 'medium', 'low'] as const).map(level => (
          <div
            key={level}
            className={difficultyBox({
              level,
              selected: selectedLevel === level
            })}
            onClick={() => handleLevelClick(level)}
          >
            난이도 {level === 'high' ? '상' : level === 'medium' ? '중' : '하'}
          </div>
        ))}
      </div>

      {/* 활동지 리스트 */}
      <Droppable droppableId="activityList" isDropDisabled={true}>
        {provided => (
          <div
            className={activityListContainer}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {activities.map((activity, index) => (
              <Activity
                isAdmin={isAdmin}
                key={activity.eduContentId}
                number={activity.eduContentId || 0}
                content={activity.title}
                thumbnailUrl={activity.thumbnailUrl!}
                index={index}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* 페이지네이션 */}
      {totalElements > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '20px',
            padding: '0 20px'
          }}
        >
          {/* 페이지 크기 선택 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>
              페이지당 항목:
            </span>
            <select
              value={size}
              onChange={e => handlePageSizeChange(Number(e.target.value))}
              style={{
                padding: '5px 10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
            <span style={{ fontSize: '14px', color: '#666' }}>
              총 {totalElements}개 중 {startIndex + 1}-
              {Math.min(endIndex, totalElements)}개 표시
            </span>
          </div>

          {/* 페이지 번호 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: page === 1 ? '#f5f5f5' : 'white',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              이전
            </button>

            {getPageNumbers().map(pageNum => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  background: page === pageNum ? '#007bff' : 'white',
                  color: page === pageNum ? 'white' : '#333',
                  cursor: 'pointer',
                  fontSize: '14px',
                  minWidth: '40px'
                }}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: page === totalPages ? '#f5f5f5' : 'white',
                cursor: page === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              다음
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
