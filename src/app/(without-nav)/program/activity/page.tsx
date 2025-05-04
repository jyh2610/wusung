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
import { useCategoryTreeStore } from '@/shared/stores/useCategoryTreeStore';

function Activity() {
  const {
    categoryTree,
    fetchCategoryTree,
    selectedCategoryNode,
    setSelectedCategoryNode
  } = useCategoryTreeStore();
  const isAdmin = true;
  const [personName, setPersonName] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<'high' | 'medium' | 'low'>(
    'medium'
  );
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<Set<number>>(
    new Set()
  );

  const { categories, fetchCategories } = useCategoryStore();

  // Map selectedLevel to difficultyLevel values
  const difficultyMap: Record<'high' | 'medium' | 'low', number> = {
    high: 1,
    medium: 2,
    low: 3
  };

  const { activities, fetchActivities, setActivities } = useActivities({
    isAdmin,
    categoryId: categoryId ?? 0,
    difficultyLevel: difficultyMap[selectedLevel] // Pass the mapped difficultyLevel
  });

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
    const { value } = event.target;
    const newPersonName = typeof value === 'string' ? value.split(',') : value;
    setPersonName(newPersonName);

    const selectedCategory = categories?.find(n => n.name === newPersonName[0]);
    if (selectedCategory) {
      setCategoryId(selectedCategory.categoryId);
    }
  };

  const handleLevelClick = (level: 'high' | 'medium' | 'low') => {
    setSelectedLevel(level);
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

  const handleSelectAll = () => {
    if (activities && activities.length > 0) {
      const allActivityIds = new Set(
        activities.map(activity => activity.eduContentId!)
      );
      setSelectedActivities(allActivityIds);
    }
  };

  const handleDeselectAll = () => {
    setSelectedActivities(new Set());
  };

  const handlePrint = async () => {
    try {
      const selectedIdsArray = Array.from(selectedActivities);
      if (selectedIdsArray.length === 0) {
        toast.warn('인쇄할 활동지를 선택해주세요.');
        return;
      }

      const pdfUrl = await printUserPrint(selectedIdsArray);

      if (pdfUrl) {
        toast.info('PDF가 로딩되면 인쇄 대화 상자가 나타납니다.'); // Updated toast message

        // 👉 iframe을 생성해서 자동 프린트
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed'; // Make it fixed position
        iframe.style.right = '0'; // Place it outside the viewport
        iframe.style.bottom = '0'; // Place it outside the viewport
        iframe.style.width = '0'; // Make it zero width
        iframe.style.height = '0'; // Make it zero height
        iframe.style.border = 'none'; // Remove border
        iframe.style.visibility = 'hidden'; // Ensure it's not visible, though 0 size should be enough
        iframe.style.pointerEvents = 'none'; // Prevent mouse interactions

        iframe.src = pdfUrl;

        iframe.onload = () => {
          // Use setTimeout with a slight delay to ensure the iframe content
          // is fully loaded and the print dialog is likely to appear.
          setTimeout(() => {
            // Check if contentWindow exists before calling methods on it
            if (iframe.contentWindow) {
              try {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
                console.log('Print dialog initiated.');
                // 사용자 인터페이스에서는 보이지 않지만, 인쇄가 끝나면 아이프레임을 수동으로 제거하도록 안내하거나
                // 다른 이벤트를 통해 제거하는 로직을 추가할 수 있습니다.
                // 여기서는 사용자가 인쇄창을 닫으면 아이프레임은 자연스럽게 연결이 끊어지므로 DOM에 남아있어도 괜찮습니다.
              } catch (printError) {
                console.error('Error initiating print on iframe:', printError);
                toast.error('인쇄 대화 상자를 열 수 없습니다.');
                // 오류 발생 시 아이프레임 제거
                if (iframe.parentElement) {
                  iframe.parentElement.removeChild(iframe);
                }
              }
            } else {
              console.error(
                'iframe contentWindow is not available after load.'
              );
              toast.error('인쇄 창을 열 수 없습니다.');
              // 오류 발생 시 아이프레임 제거
              if (iframe.parentElement) {
                iframe.parentElement.removeChild(iframe);
              }
            }
          }, 500); // 500ms delay - adjust if needed
        };

        // Optional: Add an onerror handler for the iframe
        iframe.onerror = e => {
          console.error('Error loading PDF in iframe:', e);
          toast.error('PDF 로딩 중 오류가 발생했습니다.');
          // Clean up the iframe even on error
          if (iframe.parentElement) {
            iframe.parentElement.removeChild(iframe);
          }
        };

        document.body.appendChild(iframe);

        // *** 이전 코드에서 아이프레임을 DOM에서 제거하는 setTimeout 부분을 삭제했습니다. ***
        // 아이프레임이 제거되지 않고 DOM에 유지되어 인쇄 대화 상자가 사라지지 않도록 합니다.
        // 사용자가 인쇄 대화 상자를 닫으면 아이프레임과의 연결이 해제됩니다.
      } else {
        toast.error('PDF 파일을 받지 못했습니다.');
      }
    } catch (error) {
      console.error('프린트 에러:', error);
      toast.error('인쇄 실패되었습니다!'); // Keep this toast message for general errors
    }
  };

  useEffect(() => {
    fetchCategories(isAdmin);
  }, [fetchCategories, isAdmin]);

  useEffect(() => {
    if (categories && categories.length > 0 && personName.length === 0) {
      const firstCategory = categories[0];
      setPersonName([firstCategory.name]);
      setCategoryId(firstCategory.categoryId);
    }
  }, [categories]);

  useEffect(() => {
    const fetchData = async () => {
      if (categoryId !== null) {
        try {
          await fetchActivities();
        } catch (error) {
          console.error('활동지 불러오기 실패:', error);
          toast.error('활동지 불러오기에 실패했습니다.');
          setActivities([]); // 실패시 초기화
        }
      }
    };
    fetchData();
  }, [categoryId, selectedLevel, fetchActivities, setActivities]);

  return (
    <div className={container}>
      {/* 상단 */}
      <div
        className={titleContainer}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex' }}>
          <div
            style={{
              width: '150px',
              fontSize: '32px',
              fontWeight: 600,
              color: colors.gray_scale[900],
              marginRight: '16px'
            }}
          >
            {selectedCategoryNode?.name || '카테고리 선택'}
          </div>
          <Select
            displayEmpty
            value={personName}
            onChange={handleCategoryChange}
            input={<OutlinedInput />}
            sx={{ width: '240px', height: '50px' }}
            renderValue={selected =>
              selected.length === 0 ? <em>선택</em> : selected.join(', ')
            }
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

        {/* 버튼들 */}
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

      {/* 난이도 */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
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

      {/* 활동 리스트 */}
      <div style={{ marginTop: '20px' }}>
        {activities && activities.length > 0 ? (
          <div className={activityCardContainer}>
            {activities.map(activity => (
              <div key={activity.eduContentId} className={activityCard}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span>{activity.eduContentId}</span>
                    <div>{activity.title}</div>
                  </div>
                  <Checkbox
                    checked={selectedActivities.has(activity.eduContentId!)}
                    onChange={() =>
                      handleActivitySelect(activity.eduContentId!)
                    }
                  />
                </div>
                <div
                  style={{
                    maxWidth: '256px',
                    height: '357px',
                    position: 'relative'
                  }}
                >
                  <Image src={activity.thumbnailUrl!} alt="썸네일" fill />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              marginTop: '24px',
              textAlign: 'center',
              color: colors.gray_scale[500]
            }}
          >
            활동지가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

export default Activity;
