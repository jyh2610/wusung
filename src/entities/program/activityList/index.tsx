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
  onFilterChange: (categoryId: number, difficultyLevel: number) => void;
  isAdmin: boolean;
}

export function ActivityList({ activities, onFilterChange, isAdmin }: IProps) {
  const [selectedLevel, setSelectedLevel] = useState<'high' | 'medium' | 'low'>(
    'medium'
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const { categories, fetchCategories } = useCategoryStore();
  console.log('categories', categories);
  useEffect(() => {
    fetchCategories(isAdmin);
  }, [fetchCategories]);

  // ✅ 카테고리 불러온 후 첫 번째 항목 자동 선택
  useEffect(() => {
    if (categories?.length > 0) {
      const firstCategory = categories[0];
      setSelectedCategoryId(firstCategory.categoryId);
      onFilterChange(firstCategory.categoryId, difficultyMap[selectedLevel]);
    }
  }, [categories]);

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
    onFilterChange(categoryId, difficultyMap[selectedLevel]);
  };

  const handleLevelClick = (level: 'high' | 'medium' | 'low') => {
    setSelectedLevel(level);
    if (selectedCategoryId) {
      onFilterChange(selectedCategoryId, difficultyMap[level]);
    }
  };

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
            options={categories}
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
    </div>
  );
}
