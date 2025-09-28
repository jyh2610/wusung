'use client';

import { Checkbox } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useCategoryStore } from '@/shared/stores/useCategoryStore';
import {
  activityCard,
  activityCardContainer,
  container,
  difficultyBox,
  titleContainer,
  modalOverlay,
  modalContent,
  modalHeader,
  modalTitle,
  modalCloseButton,
  modalBody,
  selectedActivityItem,
  selectedActivityInfo,
  selectedActivityThumbnail,
  selectedActivityTitle,
  selectedActivityId,
  removeActivityButton,
  topContainer,
  categorySection,
  categoryTitle,
  buttonGroup,
  buttonWrapper,
  buttonWrapperSmall,
  buttonWrapperMedium,
  difficultySection,
  activityListSection,
  emptyState,
  activityCardHeader,
  activityCardInfo,
  activityCardThumbnail,
  cascaderHighlight
} from './index.css';
import { useActivities } from '@/entities/program/scheduler/model/useActivities';
import Image from 'next/image';
import { Button } from '@/shared/ui';
import { printUserPrint } from '@/entities/program/api';
import { toast } from 'react-toastify';
import { useCategoryTreeStore } from '@/shared/stores/useCategoryTreeStore';
import { usePathname, useRouter } from 'next/navigation';
import { handleCurrentPathRoute, getCascaderOptions } from '@/lib/utils';
import { CustomCascader } from '@/shared/ui/cascader';
import { IContent, ICategoryLeaf } from '@/entities/program/type.dto';
import { useIsAdmin } from '@/components/hooks/useIsAdmin';
import { useIsFree } from '@/components/hooks/useIsFree';

function Activity() {
  const router = useRouter();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleClick = (id: string) => {
    const path = handleCurrentPathRoute(id, pathname);
    router.push(path);
  };
  const {
    categoryTree,
    fetchCategoryTree,
    selectedCategoryNode,
    setSelectedCategoryNode
  } = useCategoryTreeStore();

  const isFree = useIsFree();
  const isAdmin = useIsAdmin();
  const [personName, setPersonName] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<'high' | 'medium' | 'low'>(
    'medium'
  );
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<Set<number>>(
    new Set()
  );
  const [selectedActivitiesInfo, setSelectedActivitiesInfo] = useState<
    IContent[]
  >([]);
  const [isCascaderClicked, setIsCascaderClicked] = useState(false);

  // 페이지네이션 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { categories, fetchCategories } = useCategoryStore();

  // Map selectedLevel to difficultyLevel values
  const difficultyMap: Record<'high' | 'medium' | 'low', number> = {
    high: 1,
    medium: 2,
    low: 3
  };

  const {
    activities,
    fetchActivities,
    setActivities,
    totalElements,
    totalPages
  } = useActivities({
    isFree,
    isAdmin,
    categoryId: categoryId ?? 0,
    difficultyLevel: difficultyMap[selectedLevel],
    page: currentPage,
    size: pageSize
  });

  // 페이지네이션 계산 - 서버에서 받아온 데이터를 그대로 사용
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const MenuProps = {
    PaperProps: {
      style: {
        width: 250
      }
    }
  };

  const handleCategoryChange = (value: number[]) => {
    if (value && value.length > 0) {
      const findCategoryById = (
        categories: ICategoryLeaf[],
        targetId: number
      ): ICategoryLeaf | undefined => {
        for (const category of categories) {
          if (category.categoryId === targetId) {
            return category;
          }
          if (category.children) {
            const found = findCategoryById(category.children, targetId);
            if (found) return found;
          }
        }
        return undefined;
      };

      // 전체 경로에서 마지막 선택된 노드의 ID를 사용
      const selectedId = value[value.length - 1];
      const selectedCategory = findCategoryById(categories, selectedId);

      if (selectedCategory) {
        setPersonName([selectedCategory.name]);
        setSelectedCategoryNode(selectedCategory);
        setCategoryId(selectedCategory.categoryId);
        setCurrentPage(1); // 카테고리 변경 시 첫 페이지로 이동
      }
    }
  };

  const handleCascaderClick = () => {
    setIsCascaderClicked(true);
  };

  const handleCascaderFocus = () => {
    setIsCascaderClicked(true);
  };

  const handleLevelClick = (level: 'high' | 'medium' | 'low') => {
    console.log(
      'Level clicked:',
      level,
      'Current selectedLevel:',
      selectedLevel
    );
    setSelectedLevel(level);
    setCurrentPage(1); // 난이도 변경 시 첫 페이지로 이동
    if (selectedCategoryNode) {
      setCategoryId(selectedCategoryNode.categoryId);
    }
    console.log(
      'After setSelectedLevel, difficultyLevel will be:',
      difficultyMap[level]
    );
  };

  const handleActivitySelect = (eduContentId: number) => {
    const newSelectedActivities = new Set(selectedActivities);
    if (newSelectedActivities.has(eduContentId)) {
      newSelectedActivities.delete(eduContentId);
      setSelectedActivitiesInfo(prev =>
        prev.filter(activity => activity.eduContentId !== eduContentId)
      );
    } else {
      newSelectedActivities.add(eduContentId);
      const selectedActivity = activities.find(
        activity => activity.eduContentId === eduContentId
      );
      if (selectedActivity) {
        setSelectedActivitiesInfo(prev => [...prev, selectedActivity]);
      }
    }
    setSelectedActivities(newSelectedActivities);
  };

  const handleSelectAll = () => {
    if (activities && activities.length > 0) {
      const allActivityIds = new Set(
        activities.map(activity => activity.eduContentId!)
      );
      setSelectedActivities(allActivityIds);
      setSelectedActivitiesInfo(activities);
    }
  };

  const handleDeselectAll = () => {
    setSelectedActivities(new Set());
    setSelectedActivitiesInfo([]);
  };

  const removeSelectedActivity = (eduContentId: number) => {
    const newSelectedActivities = new Set(selectedActivities);
    newSelectedActivities.delete(eduContentId);
    setSelectedActivities(newSelectedActivities);
    setSelectedActivitiesInfo(prev =>
      prev.filter(activity => activity.eduContentId !== eduContentId)
    );
  };

  // 페이지네이션 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // 페이지 크기 변경 시 첫 페이지로 이동
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
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
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
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        iframe.style.visibility = 'hidden';
        iframe.style.pointerEvents = 'none';

        iframe.src = pdfUrl;

        iframe.onload = () => {
          setTimeout(() => {
            if (iframe.contentWindow) {
              try {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
              } catch (printError) {
                console.error('Error initiating print on iframe:', printError);
                if (iframe.parentElement) {
                  iframe.parentElement.removeChild(iframe);
                }
              }
            } else {
              console.error(
                'iframe contentWindow is not available after load.'
              );
              if (iframe.parentElement) {
                iframe.parentElement.removeChild(iframe);
              }
            }
          }, 500);
        };

        iframe.onerror = e => {
          console.error('Error loading PDF in iframe:', e);
          toast.error('PDF 로딩 중 오류가 발생했습니다.');
          if (iframe.parentElement) {
            iframe.parentElement.removeChild(iframe);
          }
        };

        document.body.appendChild(iframe);
      }
    } catch (error) {
      console.error('프린트 에러:', error);
      toast.error('인쇄 실패되었습니다!');
    }
  };

  useEffect(() => {
    fetchCategories(isAdmin, isFree);
  }, [fetchCategories, isAdmin, isFree]);

  useEffect(() => {
    if (categories && categories.length > 0 && personName.length === 0) {
      // 활동지 카테고리만 필터링
      const activityCategories = categories.filter(
        category => category.name === '활동지'
      );
      if (activityCategories.length > 0) {
        const firstCategory = activityCategories[0];
        setPersonName([firstCategory.name]);
        setCategoryId(firstCategory.categoryId);
        setSelectedCategoryNode(firstCategory);
      }
    }
  }, [categories, personName.length, setSelectedCategoryNode]);

  useEffect(() => {
    if (selectedCategoryNode) {
      setCategoryId(selectedCategoryNode.categoryId);
    }
  }, [selectedCategoryNode]);

  useEffect(() => {
    const fetchData = () => {
      if (categoryId !== null) {
        try {
          fetchActivities();
        } catch (error) {
          console.error('활동지 불러오기 실패:', error);
          toast.error('활동지 불러오기에 실패했습니다.');
          setActivities([]);
        }
      }
    };
    fetchData();
  }, [categoryId, fetchActivities, setActivities]);

  // selectedLevel 변경 시 리페칭
  useEffect(() => {
    if (categoryId !== null) {
      try {
        fetchActivities();
      } catch (error) {
        console.error('활동지 불러오기 실패:', error);
        toast.error('활동지 불러오기에 실패했습니다.');
        setActivities([]);
      }
    }
  }, [selectedLevel, categoryId, fetchActivities, setActivities]);

  const getCategoryPath = (categoryId: number): number[] => {
    const findPath = (
      categories: ICategoryLeaf[],
      targetId: number,
      currentPath: number[] = []
    ): number[] | null => {
      for (const category of categories) {
        const newPath = [...currentPath, category.categoryId];

        if (category.categoryId === targetId) {
          return newPath;
        }

        if (category.children) {
          const found = findPath(category.children, targetId, newPath);
          if (found) return found;
        }
      }
      return null;
    };

    return findPath(categories, categoryId) || [];
  };

  const getActivityCategories = (): ICategoryLeaf[] => {
    // 활동지 카테고리만 찾기
    const activityCategory = categories.find(
      category => category.name === '활동지'
    );
    if (activityCategory && activityCategory.children) {
      return [activityCategory];
    }
    return [];
  };

  return (
    <div className={container}>
      {/* 선택된 활동지 모달 */}
      {isModalOpen && (
        <div className={modalOverlay}>
          <div className={modalContent}>
            <div className={modalHeader}>
              <h2 className={modalTitle}>
                선택된 활동지 ({selectedActivitiesInfo.length})
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className={modalCloseButton}
              >
                ✕
              </button>
            </div>
            <div className={modalBody}>
              {selectedActivitiesInfo.map(activity => (
                <div
                  key={activity.eduContentId}
                  className={selectedActivityItem}
                >
                  <div className={selectedActivityInfo}>
                    <div className={selectedActivityThumbnail}>
                      <Image
                        src={activity.thumbnailUrl!}
                        alt="썸네일"
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div>
                      <div className={selectedActivityTitle}>
                        {activity.title}
                      </div>
                      <div className={selectedActivityId}>
                        ID: {activity.eduContentId}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      removeSelectedActivity(activity.eduContentId!)
                    }
                    className={removeActivityButton}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 상단 */}
      <div className={`${titleContainer} ${topContainer}`}>
        <div className={categorySection}>
          <div className={categoryTitle}>
            {selectedCategoryNode?.name || '카테고리 선택'}
          </div>
          <CustomCascader
            options={getActivityCategories()}
            value={
              selectedCategoryNode
                ? getCategoryPath(selectedCategoryNode.categoryId)
                : undefined
            }
            onChange={handleCategoryChange}
            placeholder="카테고리 선택"
            style={{ width: '240px' }}
            className={!isCascaderClicked ? cascaderHighlight : ''}
            onClick={handleCascaderClick}
          />
        </div>

        {/* 버튼들 */}
        <div className={buttonGroup}>
          <div className={buttonWrapper}>
            <Button
              content={`선택된 목록 (${selectedActivitiesInfo.length})`}
              onClick={() => setIsModalOpen(true)}
              type="borderBrand"
            />
          </div>
          <div className={buttonWrapperSmall}>
            <Button
              content="전체 선택"
              onClick={handleSelectAll}
              type="borderBrand"
            />
          </div>
          <div className={buttonWrapperSmall}>
            <Button
              content="전체 해제"
              onClick={handleDeselectAll}
              type="borderBrand"
            />
          </div>
          <div className={buttonWrapperMedium}>
            <Button content="인쇄" onClick={handlePrint} type="brand" />
          </div>
        </div>
      </div>

      {/* 난이도 */}
      <div className={difficultySection}>
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
      <div className={activityListSection}>
        {activities && activities.length > 0 ? (
          <>
            <div className={activityCardContainer}>
              {activities.map(activity => (
                <div key={activity.eduContentId} className={activityCard}>
                  <div className={activityCardHeader}>
                    <div className={activityCardInfo}>
                      <span>{activity.eduContentId}</span>
                      <div>{activity.title}</div>
                    </div>
                    <Checkbox
                      checked={selectedActivities.has(activity.eduContentId!)}
                      onChange={e => {
                        e.stopPropagation();
                        handleActivitySelect(activity.eduContentId!);
                      }}
                    />
                  </div>
                  <div
                    className={activityCardThumbnail}
                    onClick={() => handleClick(activity.eduContentId + '')}
                  >
                    <Image src={activity.thumbnailUrl!} alt="썸네일" fill />
                  </div>
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
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
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <span style={{ fontSize: '14px', color: '#666' }}>
                  페이지당 항목:
                </span>
                <select
                  value={pageSize}
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
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    background: currentPage === 1 ? '#f5f5f5' : 'white',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
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
                      background: currentPage === pageNum ? '#007bff' : 'white',
                      color: currentPage === pageNum ? 'white' : '#333',
                      cursor: 'pointer',
                      fontSize: '14px',
                      minWidth: '40px'
                    }}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    background:
                      currentPage === totalPages ? '#f5f5f5' : 'white',
                    cursor:
                      currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontSize: '14px'
                  }}
                >
                  다음
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className={emptyState}>활동지가 없습니다.</div>
        )}
      </div>
    </div>
  );
}

export default Activity;
