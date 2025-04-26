'use client';

import {
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Checkbox
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { colors } from '@/design-tokens';
import { useCategoryStore } from '@/shared/stores/useCategoryStore';
import {
  activityCard,
  activityCardContainer,
  container,
  difficultyBox,
  titleContainer
} from './index.css';
import { useActivities } from '@/entities/program/scheduler/model/useActivities';
import Image from 'next/image';
import { Button } from '@/shared/ui';
import { printUserPrint } from '@/entities/program/api';
import { toast } from 'react-toastify';

function Activity({ isAdmin }: { isAdmin: boolean }) {
  const [personName, setPersonName] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<'high' | 'medium' | 'low'>(
    'medium'
  );
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<Set<number>>(
    new Set()
  );
  const { categories, fetchCategories } = useCategoryStore();
  const { activities, setActivities } = useActivities({
    isAdmin: false,
    categoryId: categoryId ?? 0,
    difficultyLevel: 1
  });

  useEffect(() => {
    fetchCategories(isAdmin);
  }, [fetchCategories]);

  const MenuProps = {
    PaperProps: {
      style: {
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

    const selectedCategory = categories.find(n => n.name === newPersonName[0]);

    if (selectedCategory) {
      setCategoryId(selectedCategory.categoryId);
    }
  };

  const handleLevelClick = (level: 'high' | 'medium' | 'low') => {
    setSelectedLevel(level);
    const selectedCategory = categories.find(n => n.name === personName[0]);
    if (selectedCategory) {
      setCategoryId(selectedCategory.categoryId);
    }
  };

  const handleActivitySelect = (eduContentId: number) => {
    const newSelectedActivities = new Set(selectedActivities);
    if (newSelectedActivities.has(eduContentId)) {
      newSelectedActivities.delete(eduContentId);
    } else {
      newSelectedActivities.add(eduContentId);
    }
    setSelectedActivities(newSelectedActivities);
  };

  // Handle "Select All" button
  const handleSelectAll = () => {
    const allActivityIds = new Set(
      activities.map(activity => activity.eduContentId!)
    );
    setSelectedActivities(allActivityIds);
  };

  // Handle "Deselect All" button
  const handleDeselectAll = () => {
    setSelectedActivities(new Set());
  };

  const handlePrint = async () => {
    try {
      const selectedIdsArray = Array.from(selectedActivities);
      // const selectedIdsArray = [...selectedActivities]; // Alternative

      if (selectedIdsArray.length === 0) {
        toast.warn('인쇄할 활동지를 선택해주세요.');
        return;
      }

      console.log('Requesting PDF for printing IDs:', selectedIdsArray);
      const pdfUrl = await printUserPrint(selectedIdsArray);

      toast.info(
        'PDF가 새 탭에서 열립니다. 해당 탭의 인쇄 기능을 이용해 주세요.'
      );
      if (pdfUrl) {
        // --- 새 탭에서 PDF 열기 ---
        window.open(pdfUrl, '_blank'); // 새 탭/창에서 PDF URL 열기
      } else {
        toast.error('PDF 파일을 받지 못했습니다.');
      }
    } catch (error) {
      console.error('프린트 에러:', error);
      toast.error('인쇄 실패되었습니다!');
    }
  };

  return (
    <div className={container}>
      <div
        className={titleContainer}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <span
            style={{
              fontSize: '32px',
              fontWeight: 600,
              color: colors.gray_scale[900],
              marginRight: '16px' // Add space between title and dropdown
            }}
          >
            인지활동지 목록
          </span>
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
            {categories?.map(name => (
              <MenuItem key={name.categoryId} value={name.name}>
                {name.name}
              </MenuItem>
            ))}
          </Select>
        </div>

        {/* Dropdown and Buttons */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ width: '113px', height: '56px' }}>
            <Button
              content="전체 선택"
              onClick={handleSelectAll}
              type="borderBrand"
            />
          </div>
          <div style={{ width: '113px', height: '56px' }}>
            <Button
              content="전체 해제"
              onClick={handleDeselectAll}
              type="borderBrand"
            />
          </div>
          <div style={{ width: '160px', height: '56px' }}>
            <Button content="인쇄" onClick={handlePrint} type="brand" />
          </div>
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

      <div style={{ marginTop: '20px' }}>
        <div className={activityCardContainer}>
          {activities.map(activity => (
            <div key={activity.eduContentId} className={activityCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}
                >
                  <span>{activity.eduContentId}</span>
                  <div>{activity.title}</div>
                </div>
                <Checkbox
                  checked={selectedActivities.has(activity.eduContentId!)}
                  onChange={() => handleActivitySelect(activity.eduContentId!)}
                />
              </div>
              <div
                style={{
                  maxWidth: '256px',
                  height: '357px',
                  position: 'relative'
                }}
              >
                <Image src={activity.thumbnailUrl!} alt={'썸네일'} fill />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Activity;
