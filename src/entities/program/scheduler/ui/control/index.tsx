'use client';

import React, { useState } from 'react';
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
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { getPlan } from '@/entities/program/api';
import { autoRegisterPlan } from '../../model/autoRegisterPlan';
import { useDateStore } from '@/shared/stores/useDateStores';
import { useUserStore } from '@/shared/stores/useUserStore';
import { toast } from 'react-toastify';
import { color } from 'bun';
import { colors } from '@/design-tokens';

export function Control({ isAdmin }: { isAdmin: boolean }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'etc' | 'cover' | null>(null);
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
    try {
      await getPlan({
        year,
        month,
        difficultyLevel: selectedUser.difficultyLevel
      });

      await autoRegisterPlan({
        year,
        month,
        difficultyLevel: selectedUser.difficultyLevel
      });
    } catch (error) {
      console.error('계획안 불러오기 실패:', error);
    }
  };

  const handleDeleteItem = (id: number) => {
    removeEtcItem(id);
  };

  const handleDeleteCover = () => {
    removeCoverItems();
  };

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
      </div>

      <div className={additionalData}>
        {/* 기타자료 */}

        <div
          className={buttonStyle}
          style={{
            backgroundColor: noPrintDate ? colors.brand[400] : '#f0f0f0',
            color: noPrintDate ? colors.gray_scale['default'] : '',
            transition: 'background-color 0.2s ease',
            position: 'relative',
            width: '150px'
          }}
          onClick={toggleNoPrintDate}
        >
          <button type="button">날짜 출력</button>
        </div>

        <Droppable droppableId="etc" isDropDisabled={false}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={buttonStyle}
              style={{
                position: 'relative',
                backgroundColor: snapshot.isDraggingOver
                  ? '#f0f0f0'
                  : 'transparent',
                transition: 'background-color 0.2s ease',
                padding: '8px',
                width: '150px'
              }}
              onClick={() => openModal('etc')}
            >
              <button type="button">기타자료</button>

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

              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* 커버 */}
        <Droppable droppableId="cover" isDropDisabled={false}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={buttonStyle}
              style={{
                backgroundColor: snapshot.isDraggingOver
                  ? '#f0f0f0'
                  : 'transparent',
                transition: 'background-color 0.2s ease',
                position: 'relative',
                width: '150px'
              }}
              onClick={() => openModal('cover')}
            >
              <button type="button">커버</button>

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
                {coverItems.content.length > 0 ? 1 : 0}
              </div>

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

            <h2>{modalType === 'etc' ? '기타자료 목록' : '커버 목록'}</h2>

            <div style={{ marginTop: '20px' }}>
              {/* 기타자료 목록 */}
              {modalType === 'etc' &&
                (etcItems.length > 0 ? (
                  <ul style={{ padding: 0, listStyle: 'none' }}>
                    {etcItems.map(item => (
                      <li
                        key={item.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px',
                          borderBottom: '1px solid #eee',
                          paddingBottom: '4px'
                        }}
                      >
                        <span>{item.content}</span>
                        <button
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: 'red',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          삭제
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>등록된 기타자료가 없습니다.</p>
                ))}

              {/* 커버 목록 */}
              {modalType === 'cover' &&
                (coverItems.content ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <p>{coverItems.content}</p>
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
                  <p>등록된 커버가 없습니다.</p>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
