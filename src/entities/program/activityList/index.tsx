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

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder'
];
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

interface IProps {
  activities: IContent[];
}

export function ActivityList({ activities }: IProps) {
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

  function getStyles(
    name: string,
    personName: readonly string[],
    theme: Theme
  ) {
    return {
      fontWeight: personName.includes(name)
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular
    };
  }

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value }
    } = event;
    setPersonName(typeof value === 'string' ? value.split(',') : value);
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
            multiple
            displayEmpty
            value={personName}
            onChange={handleChange}
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
            {Array.isArray(names) &&
              names.map(name => (
                <MenuItem key={name.categoryId} value={name.name}>
                  {name.name}
                </MenuItem>
              ))}
          </Select>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <div
          className={difficultyBox({
            level: 'high',
            selected: selectedLevel === 'high'
          })}
          onClick={() => setSelectedLevel('high')}
        >
          난이도 상
        </div>
        <div
          className={difficultyBox({
            level: 'medium',
            selected: selectedLevel === 'medium'
          })}
          onClick={() => setSelectedLevel('medium')}
        >
          난이도 중
        </div>
        <div
          className={difficultyBox({
            level: 'low',
            selected: selectedLevel === 'low'
          })}
          onClick={() => setSelectedLevel('low')}
        >
          난이도 하
        </div>
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
                key={activity.eduContentId} // `activity.number`와 `activity.content` 조합
                number={activity.eduContentId!}
                content={activity.title}
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
