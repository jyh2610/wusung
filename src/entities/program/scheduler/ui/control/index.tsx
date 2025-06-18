'use client';

import React, { useState, useEffect } from 'react';
import { IoReload } from 'react-icons/io5';
import {
  controlContainer,
  buttonStyle,
  additionalData,
  Container,
  modalOverlay,
  modalContent,
  closeButton
} from './index.css';
import { useScheduleStore } from '@/shared/stores/useScheduleStore';
import { Droppable } from '@hello-pangea/dnd';
import {
  getPlan,
  getContentByIds,
  getContent,
  getAdminPlan,
  searchContent,
  getAdminContentByIds
} from '@/entities/program/api';
import { autoRegisterPlan } from '../../model/autoRegisterPlan';
import { useDateStore } from '@/shared/stores/useDateStores';
import { useUserStore } from '@/shared/stores/useUserStore';
import { toast } from 'react-toastify';
import { colors } from '@/design-tokens';
import { useSearchParams } from 'next/navigation';
import { IContent } from '@/entities/program/type.dto';
import Image from 'next/image';

export function Control({ isAdmin }: { isAdmin: boolean }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'etc' | 'cover' | null>(null);
  const [coverContent, setCoverContent] = useState<IContent | null>(null);
  const [etcContents, setEtcContents] = useState<IContent[]>([]);
  const [showCount, setShowCount] = useState(false);
  const { reInit, removeEtcItem, removeCoverItems } = useScheduleStore();
  const coverItems = useScheduleStore(state => state.coverItems);
  const etcItems = useScheduleStore(state => state.etcItems);
  const addEtcItem = useScheduleStore(state => state.addEtcItem);
  const { noPrintDate, toggleNoPrintDate } = useScheduleStore(state => ({
    noPrintDate: state.noPrintDate,
    toggleNoPrintDate: state.toggleNoPrintDate
  }));

  const { year, month } = useDateStore();
  const selectedUserId = useUserStore(state => state.selectedUserId);
  const users = useUserStore.getState().users;
  const selectedUser = users.find(user => user.elderId === selectedUserId);

  const searchParams = useSearchParams();

  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(() => {
    const difficultyid = searchParams.get('difficultyid');
    return difficultyid ? Number(difficultyid) : 2;
  });

  useEffect(() => {
    const difficultyid = searchParams.get('difficultyid');
    if (difficultyid) {
      setSelectedDifficulty(Number(difficultyid));
    }
  }, [searchParams]);

  // 컴포넌트 마운트 시 1초 후에 카운트 표시
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCount(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleLoadPlan = async (
    year: number,
    month: number,
    difficultyLevel: number
  ) => {
    try {
      let plan;
      if (isAdmin) {
        // 어드민인 경우 getAdminPlan 사용
        const scheduleId = Number(searchParams.get('scheduleId'));
        if (!scheduleId) {
          toast.error('스케줄 ID가 필요합니다.');
          return;
        }
        plan = await getAdminPlan(scheduleId);
      } else {
        // 일반 사용자인 경우 getPlan 사용
        plan = await getPlan({
          year,
          month,
          difficultyLevel
        });
      }

      // autoRegisterPlan이 모든 데이터를 처리하도록 수정
      await autoRegisterPlan({
        year,
        month,
        difficultyLevel
      });
    } catch (error) {
      console.error('계획안 불러오기 실패:', error);
      toast.error('계획안을 불러오는데 실패했습니다.');
    }
  };

  useEffect(() => {
    const difficultyid = searchParams.get('difficultyid');
    const yearParam = searchParams.get('year');
    const monthParam = searchParams.get('month');

    if (difficultyid && yearParam && monthParam) {
      handleLoadPlan(
        Number(yearParam),
        Number(monthParam),
        Number(difficultyid)
      );
    }
  }, [searchParams, isAdmin]);

  // etcItems가 변경될 때 etcContents 업데이트
  useEffect(() => {
    const fetchContents = async () => {
      console.log('fetchContents called with etcItems:', etcItems);

      // etcItems가 비어있으면 etcContents도 비우기
      if (etcItems.length === 0) {
        setEtcContents([]);
        return;
      }

      // 드래그 앤 드롭으로 추가된 아이템들의 컨텐츠 정보 가져오기
      const newEtcIds = etcItems
        .filter(
          item => !etcContents.some(content => content.eduContentId === item.id)
        )
        .map(item => item.id);

      if (newEtcIds.length > 0) {
        try {
          const newContents = await getContentByIds(newEtcIds);
          console.log('fetched newContents:', newContents);

          if (newContents.length > 0) {
            setEtcContents(prev => {
              const uniqueContents = [...prev];
              newContents.forEach(newContent => {
                if (
                  newContent &&
                  newContent.eduContentId &&
                  !uniqueContents.some(
                    content => content.eduContentId === newContent.eduContentId
                  )
                ) {
                  uniqueContents.push(newContent);
                }
              });
              console.log('updated etcContents:', uniqueContents);
              return uniqueContents;
            });
          }
        } catch (error) {
          console.error('컨텐츠 조회 실패:', error);
        }
      }
    };

    fetchContents();
  }, [etcItems]);

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    return () => {
      reInit();
      setCoverContent(null);
      setEtcContents([]);
    };
  }, []);

  // coverItems가 변경될 때 coverContent 업데이트
  useEffect(() => {
    const updateCoverContent = async () => {
      console.log('updateCoverContent called with coverItems:', coverItems);

      if (coverItems?.id) {
        try {
          const content = await getContent(coverItems.id);
          console.log('fetched cover content:', content);

          if (content) {
            setCoverContent(content);
          }
        } catch (error) {
          console.error('커버 컨텐츠 조회 실패:', error);
        }
      } else {
        setCoverContent(null);
      }
    };
    updateCoverContent();
  }, [coverItems]);

  const openModal = (type: 'etc' | 'cover') => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalType(null);
    setModalOpen(false);
  };

  const handleConfirm = async () => {
    if (!selectedUser?.difficultyLevel) {
      toast.warn('대상자를 선택해주세요');
      return;
    }
    await autoRegisterPlan({
      year,
      month,
      difficultyLevel: selectedUser.difficultyLevel
    });
  };

  const handleDeleteItem = (id: number) => {
    removeEtcItem(id);
    setEtcContents(prev => prev.filter(content => content.eduContentId !== id));
  };

  const handleDeleteCover = () => {
    removeCoverItems();
    setCoverContent(null);
  };

  const handleDifficultySelect = (difficulty: number) => {
    setSelectedDifficulty(difficulty);
    useScheduleStore.getState().setSelectedDifficulty(difficulty);
  };

  // 스타일 추가
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      li:hover .thumbnail-popup,
      div:hover .thumbnail-popup {
        display: block !important;
      }
    `;
    document.head.appendChild(style);

    // cleanup
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className={Container}>
      <div className={controlContainer}>
        <button className={buttonStyle} onClick={reInit}>
          <IoReload size={24} />
          초기화
        </button>
        {!isAdmin && (
          <button className={buttonStyle} onClick={handleConfirm}>
            계획안 불러오기
          </button>
        )}
        {isAdmin && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={buttonStyle}
              style={{
                backgroundColor:
                  selectedDifficulty === 1 ? colors.brand[500] : 'white',
                color: selectedDifficulty === 1 ? 'white' : 'black',
                border: `1px solid ${colors.brand[500]}`,
                minWidth: '60px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: selectedDifficulty === 1 ? 'bold' : 'normal'
              }}
              onClick={() => handleDifficultySelect(1)}
            >
              {selectedDifficulty === 1 ? '상' : '상'}
            </button>
            <button
              className={buttonStyle}
              style={{
                backgroundColor:
                  selectedDifficulty === 2 ? colors.brand[500] : 'white',
                color: selectedDifficulty === 2 ? 'white' : 'black',
                border: `1px solid ${colors.brand[500]}`,
                minWidth: '60px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: selectedDifficulty === 2 ? 'bold' : 'normal'
              }}
              onClick={() => handleDifficultySelect(2)}
            >
              {selectedDifficulty === 2 ? '중' : '중'}
            </button>
            <button
              className={buttonStyle}
              style={{
                backgroundColor:
                  selectedDifficulty === 3 ? colors.brand[500] : 'white',
                color: selectedDifficulty === 3 ? 'white' : 'black',
                border: `1px solid ${colors.brand[500]}`,
                minWidth: '60px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: selectedDifficulty === 3 ? 'bold' : 'normal'
              }}
              onClick={() => handleDifficultySelect(3)}
            >
              {selectedDifficulty === 3 ? '하' : '하'}
            </button>
          </div>
        )}
      </div>

      <div className={additionalData}>
        {/* 커버 */}
        <Droppable droppableId="cover" isDropDisabled={false}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={buttonStyle}
              style={{
                backgroundColor: snapshot.isDraggingOver ? '#f5f7fa' : 'white',
                transition: 'background-color 0.2s',
                position: 'relative',
                width: '150px',
                fontSize: '16px',
                fontWeight: 500,
                textAlign: 'center'
              }}
              onClick={() => openModal('cover')}
            >
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                표지
              </div>

              {showCount && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-10px',
                    backgroundColor: 'red',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {coverItems ? 1 : 0}
                </div>
              )}

              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* 기타자료 */}
        <Droppable droppableId="etc" isDropDisabled={false}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={buttonStyle}
              style={{
                position: 'relative',
                backgroundColor: snapshot.isDraggingOver ? '#f5f7fa' : 'white',
                transition: 'background-color 0.2s',
                padding: '8px',
                width: '150px',
                fontSize: '16px',
                fontWeight: 500,
                textAlign: 'center'
              }}
              onClick={() => openModal('etc')}
            >
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                기타자료
              </div>

              {showCount && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-10px',
                    backgroundColor: 'red',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {etcItems.length}
                </div>
              )}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>

      {/* ✅ 모달 */}
      {isModalOpen && (
        <div className={modalOverlay} onClick={closeModal}>
          <div className={modalContent} onClick={e => e.stopPropagation()}>
            <button className={closeButton} onClick={closeModal}>
              ✕
            </button>

            <h2>{modalType === 'etc' ? '기타자료 목록' : '표지 목록'}</h2>

            <div style={{ marginTop: '20px' }}>
              {/* 기타자료 목록 */}
              {modalType === 'etc' &&
                (etcItems.length > 0 ? (
                  <ul style={{ padding: 0, listStyle: 'none' }}>
                    {etcItems.map(content => (
                      <li
                        key={content.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px',
                          borderBottom: '1px solid #eee',
                          paddingBottom: '4px',
                          position: 'relative',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={() => {
                          const popup = document.querySelector(
                            `#thumbnail-${content.id}`
                          );
                          if (popup) {
                            (popup as HTMLElement).style.display = 'block';
                          }
                        }}
                        onMouseLeave={() => {
                          const popup = document.querySelector(
                            `#thumbnail-${content.id}`
                          );
                          if (popup) {
                            (popup as HTMLElement).style.display = 'none';
                          }
                        }}
                      >
                        <span>{content.content}</span>
                        <button
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: 'red',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleDeleteItem(content.id)}
                        >
                          삭제
                        </button>
                        {content.thumbnailUrl && (
                          <div
                            id={`thumbnail-${content.id}`}
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: 'calc(100% + 8px)',
                              backgroundColor: 'white',
                              border: '1px solid #ddd',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                              padding: '4px',
                              borderRadius: '8px',
                              width: '150px',
                              height: '250px',
                              zIndex: 1300,
                              display: 'none'
                            }}
                          >
                            <Image
                              src={content.thumbnailUrl}
                              alt="thumbnail"
                              fill
                              style={{
                                borderRadius: '8px',
                                objectFit: 'contain'
                              }}
                            />
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>등록된 기타자료가 없습니다.</p>
                ))}

              {/* 커버 목록 */}
              {modalType === 'cover' &&
                (coverItems !== null ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      position: 'relative'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={() => {
                        const popup = document.querySelector(
                          `#cover-thumbnail-popup`
                        );
                        if (popup) {
                          (popup as HTMLElement).style.display = 'block';
                        }
                      }}
                      onMouseLeave={() => {
                        const popup = document.querySelector(
                          `#cover-thumbnail-popup`
                        );
                        if (popup) {
                          (popup as HTMLElement).style.display = 'none';
                        }
                      }}
                    >
                      <p style={{ margin: 0 }}>{coverItems.content}</p>
                      {coverItems.thumbnailUrl && (
                        <div
                          id="cover-thumbnail-popup"
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 'calc(100% + 8px)',
                            backgroundColor: 'white',
                            border: '1px solid #ddd',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            padding: '4px',
                            borderRadius: '8px',
                            width: '150px',
                            height: '250px',
                            zIndex: 1300,
                            display: 'none'
                          }}
                        >
                          <Image
                            src={coverItems.thumbnailUrl}
                            alt="thumbnail"
                            fill
                            style={{
                              borderRadius: '8px',
                              objectFit: 'contain'
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <button
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: 'red',
                        cursor: 'pointer'
                      }}
                      onClick={handleDeleteCover}
                    >
                      삭제
                    </button>
                  </div>
                ) : (
                  <p>등록된 표지가 없습니다.</p>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
