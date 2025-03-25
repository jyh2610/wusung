'use client';

import {
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Theme,
  useTheme
} from '@mui/material';
import React, { useState } from 'react';
import { colors } from '@/design-tokens';
import { Activity } from './Activity';
import {
  activityListContainer,
  difficultyBox,
  titleContainer
} from './index.css';

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

const activities = [
  { number: 1, content: '사자성어 쓰기' },
  { number: 2, content: '독서 감상문' },
  { number: 3, content: '수학 문제 풀이' },
  { number: 4, content: '역사 연표 정리' },
  { number: 5, content: '과학 실험 기록' },
  { number: 6, content: '운동 계획 세우기' },
  { number: 7, content: '일기 쓰기' },
  { number: 8, content: '영어 단어 외우기' },
  { number: 9, content: '미술 작품 감상' },
  { number: 10, content: '음악 감상문 쓰기' }
];

export function ActivityList() {
  const theme = useTheme();
  const [personName, setPersonName] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<'high' | 'medium' | 'low'>(
    'medium'
  );

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
            {names.map(name => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name, personName, theme)}
              >
                {name}
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
      <div className={activityListContainer}>
        {activities.map((activity, index) => (
          <Activity
            key={index}
            number={activity.number}
            content={activity.content}
          />
        ))}
      </div>
    </div>
  );
}
