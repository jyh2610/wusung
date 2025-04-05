import React, { useState } from 'react';
import { IoReload } from 'react-icons/io5';
import { LuUndo2, LuRedo2 } from 'react-icons/lu';
import {
  controlContainer,
  buttonStyle,
  closeButton,
  confirmButtonWrapper,
  filterSection,
  modalContent,
  modalOverlay,
  planItem,
  planList,
  additionalData,
  Container
} from './index.css';
import { useScheduleStore } from '@/shared/stores/useScheduleStore';
import { getPlan, IPlan } from '@/entities/program/api';
import { Schedule } from '@/entities/program/type.dto';
import { Button } from '@/shared/ui';
import { autoRegisterPlan } from '../../model/autoRegisterPlan';
import { Draggable, Droppable } from '@hello-pangea/dnd';

export function Control({ isAdmin }: { isAdmin: boolean }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const { undo, redo, reInit } = useScheduleStore();
  const coverItems = useScheduleStore(state => state.coverItems);
  const etcItems = useScheduleStore(state => state.etcItems);
  console.log(etcItems);

  return (
    <div className={Container}>
      <div className={controlContainer}>
        <button className={buttonStyle} onClick={undo}>
          <LuUndo2 size={24} />
          실행 취소
        </button>
        <button className={buttonStyle} onClick={redo}>
          <LuRedo2 size={24} />
          실행 복구
        </button>
        <button className={buttonStyle} onClick={reInit}>
          <IoReload size={24} />
          초기화
        </button>
        {!isAdmin && (
          <button className={buttonStyle} onClick={() => setModalOpen(true)}>
            계획안 불러오기
          </button>
        )}
      </div>
      <div className={additionalData}>
        <Droppable droppableId="extra" isDropDisabled={false}>
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
                padding: '8px'
              }}
            >
              <button>기타자료</button>

              {/* 숫자 표시 (우상단) */}
              <div
                style={{
                  position: 'absolute',
                  top: '0px',
                  right: '4px',
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

              {/* 드래그 가능한 아이템들 */}
              <div style={{ marginTop: '8px' }}>
                {etcItems.map((item, index) => (
                  <Draggable
                    key={item.id.toString()}
                    draggableId={`etc-${item.id}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          padding: '4px 8px',
                          marginBottom: '4px',
                          backgroundColor: snapshot.isDragging
                            ? '#ddd'
                            : '#fff',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          ...provided.draggableProps.style
                        }}
                      >
                        {item.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>

        <Droppable droppableId={`cover`} isDropDisabled={false}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={buttonStyle}
              style={{
                backgroundColor: snapshot.isDraggingOver
                  ? '#f0f0f0'
                  : 'transparent',
                transition: 'background-color 0.2s ease'
              }}
            >
              <button>커버</button>
              <div style={{ display: 'none' }}>{provided.placeholder}</div>
            </div>
          )}
        </Droppable>
      </div>
      {isModalOpen && <PlanModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}

interface IProps {
  onClose: () => void;
}

const PlanModal = ({ onClose }: IProps) => {
  const [plans, setPlans] = useState<IPlan>();
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [difficultyLevel, setDifficultyLevel] = useState(1);

  const updateSchedule = useScheduleStore(state => state.updateSchedule);

  const handleConfirm = async () => {
    try {
      const res = await getPlan({ year, month, difficultyLevel });
      setPlans(res);
      console.log(res);

      await autoRegisterPlan({
        year: year,
        month: month,
        difficultyLevel: difficultyLevel
      });
    } catch (error) {
      console.error('계획안 불러오기 실패:', error);
    }
    onClose();
  };

  const currentYear = new Date().getFullYear();
  const yearRange = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <div className={modalOverlay}>
      <div className={modalContent} style={{ position: 'relative' }}>
        <button className={closeButton} onClick={onClose}>
          ✕
        </button>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: '500',
            marginBottom: '12px'
          }}
        >
          계획안 불러오기
        </h1>

        <div className={filterSection}>
          <label>
            <select value={year} onChange={e => setYear(e.target.value)}>
              {Array.from({ length: 11 }, (_, i) => {
                const y = new Date().getFullYear() - 5 + i;
                return (
                  <option key={y} value={y.toString()}>
                    {y}년
                  </option>
                );
              })}
            </select>
          </label>

          <label>
            <select value={month} onChange={e => setMonth(e.target.value)}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m.toString()}>
                  {m}월
                </option>
              ))}
            </select>
          </label>

          <label>
            <select
              value={difficultyLevel}
              onChange={e => setDifficultyLevel(Number(e.target.value))}
            >
              {[1, 2, 3].map(level => (
                <option key={level} value={level}>
                  {level === 1 ? '상' : level === 2 ? '중' : '하'}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={confirmButtonWrapper}>
          <Button onClick={handleConfirm} content="확인" type="brand" />
        </div>
      </div>
    </div>
  );
};
