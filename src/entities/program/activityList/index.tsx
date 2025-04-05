'use client';

import { Droppable } from '@hello-pangea/dnd';
import {
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Theme,
  useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { colors } from '@/design-tokens';
import { Activity } from './Activity';
import {
  activityListContainer,
  difficultyBox,
  titleContainer
} from './index.css';
import { ICategoryLeaf, IContent } from '../type.dto';
import { getCategoryLeaf } from '../api';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const difficultyMap = {
  high: 3,
  medium: 2,
  low: 1
};

interface IProps {
  activities: IContent[];
  onFilterChange: (categoryId: number, difficultyLevel: number) => void;
}

export function ActivityList({ activities, onFilterChange }: IProps) {
  const theme = useTheme();
  const [personName, setPersonName] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<'high' | 'medium' | 'low'>(
    'medium'
  );
  const [names, setLeaf] = useState<ICategoryLeaf[]>([]);

  useEffect(() => {
    const getList = async () => {
      const res = await getCategoryLeaf();
      setLeaf(res);
    };
    getList();
  }, []);

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  };

  const handleCategoryChange = (
    event: SelectChangeEvent<typeof personName>
  ) => {
    const {
      target: { value }
    } = event;
    const newPersonName = typeof value === 'string' ? value.split(',') : value;
    setPersonName(newPersonName);

    const selectedCategory = names.find(n => n.name === newPersonName[0]);
    if (selectedCategory) {
      onFilterChange(selectedCategory.categoryId, difficultyMap[selectedLevel]);
    }
  };

  const handleLevelClick = (level: 'high' | 'medium' | 'low') => {
    setSelectedLevel(level);
    const selectedCategory = names.find(n => n.name === personName[0]);
    if (selectedCategory) {
      onFilterChange(selectedCategory.categoryId, difficultyMap[level]);
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
          <Select
            displayEmpty
            value={personName}
            onChange={handleCategoryChange}
            input={<OutlinedInput />}
            sx={{ width: '240px', height: '50px' }}
            renderValue={selected => {
              if (selected.length === 0) {
                return <em>선택</em>;
              }

              return selected.join(', ');
            }}
            MenuProps={MenuProps}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem disabled value="">
              <em>선택</em>
            </MenuItem>
            {names.map(name => (
              <MenuItem key={name.categoryId} value={name.name}>
                {name.name}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
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
      <Droppable droppableId="activityList" isDropDisabled={true}>
        {provided => (
          <div
            className={activityListContainer}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {activities.map((activity, index) => (
              <Activity
                key={activity.eduContentId}
                number={activity.eduContentId || 0}
                content={activity.title}
                thumbnailUrl={activity.thumbnailUrl}
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
