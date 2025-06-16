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
  titleContainer
} from './ETC.css';
import { useActivities } from '@/entities/program/scheduler/model/useActivities';
import Image from 'next/image';
import { Button } from '@/shared/ui';
import { printUserPrint } from '@/entities/program/api';
import { toast } from 'react-toastify';
import { useCategoryTreeStore } from '@/shared/stores/useCategoryTreeStore';
import { usePathname, useRouter } from 'next/navigation';
import { handleCurrentPathRoute } from '@/lib/utils';
import { CustomCascader } from '@/shared/ui/cascader';
import { IContent, ICategoryLeaf } from '@/entities/program/type.dto';
import { useIsAdmin } from '@/components/hooks/useIsAdmin';

function ETC() {
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

  const isAdmin = useIsAdmin();
  const [personName, setPersonName] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<Set<number>>(
    new Set()
  );
  const [selectedActivitiesInfo, setSelectedActivitiesInfo] = useState<
    IContent[]
  >([]);

  const { categories, fetchCategories } = useCategoryStore();

  const { activities, fetchActivities, setActivities } = useActivities({
    isAdmin,
    categoryId: categoryId ?? 0,
    difficultyLevel: 0
  });

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

      const selectedId = value[value.length - 1];
      const selectedCategory = findCategoryById(categories, selectedId);

      if (selectedCategory) {
        setPersonName([selectedCategory.name]);
        setSelectedCategoryNode(selectedCategory);
        setCategoryId(selectedCategory.categoryId);
      }
    }
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
                console.log('Print dialog initiated.');
              } catch (printError) {
                console.error('Error initiating print on iframe:', printError);
                toast.error('인쇄 대화 상자를 열 수 없습니다.');
                if (iframe.parentElement) {
                  iframe.parentElement.removeChild(iframe);
                }
              }
            } else {
              console.error(
                'iframe contentWindow is not available after load.'
              );
              toast.error('인쇄 창을 열 수 없습니다.');
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
      } else {
        toast.error('PDF 파일을 받지 못했습니다.');
      }
    } catch (error) {
      console.error('프린트 에러:', error);
      toast.error('인쇄 실패되었습니다!');
    }
  };

  useEffect(() => {
    fetchCategories(isAdmin);
  }, [fetchCategories, isAdmin]);

  useEffect(() => {
    if (categories && categories.length > 0 && personName.length === 0) {
      const etcCategories = categories.filter(
        category => category.name === '기타자료'
      );
      if (etcCategories.length > 0) {
        const firstCategory = etcCategories[0];
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
          console.error('기타자료 불러오기 실패:', error);
          toast.error('기타자료 불러오기에 실패했습니다.');
          setActivities([]);
        }
      }
    };
    fetchData();
  }, [categoryId, fetchActivities, setActivities]);

  return (
    <div className={container}>
      {/* 선택된 활동지 모달 */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '8px',
              width: '80%',
              maxWidth: '600px',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}
            >
              <h2 style={{ margin: 0 }}>
                선택된 활동지 ({selectedActivitiesInfo.length})
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: colors.gray_scale[500]
                }}
              >
                ✕
              </button>
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {selectedActivitiesInfo.map(activity => (
                <div
                  key={activity.eduContentId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    border: '1px solid #eee',
                    borderRadius: '4px'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center'
                    }}
                  >
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        position: 'relative',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}
                    >
                      <Image
                        src={activity.thumbnailUrl!}
                        alt="썸네일"
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{activity.title}</div>
                      <div
                        style={{
                          color: colors.gray_scale[500],
                          fontSize: '14px'
                        }}
                      >
                        ID: {activity.eduContentId}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      removeSelectedActivity(activity.eduContentId!)
                    }
                    style={{
                      background: 'none',
                      border: 'none',
                      color: colors.gray_scale[500],
                      cursor: 'pointer',
                      padding: '8px'
                    }}
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
          <CustomCascader
            options={categories.filter(category => {
              if (category.name === '기타자료') return true;
              return (
                category.parentId &&
                categories.find(c => c.categoryId === category.parentId)
                  ?.name === '기타자료'
              );
            })}
            value={
              selectedCategoryNode
                ? [selectedCategoryNode.categoryId]
                : undefined
            }
            onChange={handleCategoryChange}
            placeholder="카테고리 선택"
            style={{ width: '240px' }}
          />
        </div>

        {/* 버튼들 */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ width: '150px', height: '56px' }}>
            <Button
              content={`선택된 목록 (${selectedActivitiesInfo.length})`}
              onClick={() => setIsModalOpen(true)}
              type="borderBrand"
            />
          </div>
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
                    onChange={e => {
                      e.stopPropagation();
                      handleActivitySelect(activity.eduContentId!);
                    }}
                  />
                </div>
                <div
                  style={{
                    maxWidth: '256px',
                    height: '357px',
                    position: 'relative'
                  }}
                  onClick={() => handleClick(activity.eduContentId + '')}
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

export default ETC;
