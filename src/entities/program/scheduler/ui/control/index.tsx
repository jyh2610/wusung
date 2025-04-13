import React, { useState } from 'react';
import { IoReload } from 'react-icons/io5';
import {
  controlContainer,
  buttonStyle,
  additionalData,
  Container
} from './index.css';
import { useScheduleStore } from '@/shared/stores/useScheduleStore';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { IPlan, getPlan } from '@/entities/program/api';
import { autoRegisterPlan } from '../../model/autoRegisterPlan';
import { useDateStore } from '@/shared/stores/useDateStores';
import { useUserStore } from '@/shared/stores/useUserStore';
import { toast } from 'react-toastify';

export function Control({ isAdmin }: { isAdmin: boolean }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const { undo, redo, reInit } = useScheduleStore();
  const coverItems = useScheduleStore(state => state.coverItems);
  const etcItems = useScheduleStore(state => state.etcItems);
  const addEtcItem = useScheduleStore(state => state.addEtcItem);
  const { year, month } = useDateStore();
  const selectedUserId = useUserStore(state => state.selectedUserId);
  const users = useUserStore.getState().users;
  const selectedUser = users.find(user => user.elderId === selectedUserId);
  const handleDrop = (item: any) => {
    addEtcItem(item);
  };

  const handleConfirm = async ({}) => {
    if (!selectedUser?.difficultyLevel) toast.warn('대상자를 선택해주세요');
    try {
      const res = await getPlan({
        year,
        month,
        difficultyLevel: selectedUser?.difficultyLevel!
      });
      console.log(res);

      await autoRegisterPlan({
        year: year,
        month: month,
        difficultyLevel: selectedUser?.difficultyLevel!
      });
    } catch (error) {
      console.error('계획안 불러오기 실패:', error);
    }
  };
  return (
    <div className={Container}>
      <div className={controlContainer}>
        {/* <button className={buttonStyle} onClick={undo}>
          <LuUndo2 size={24} />
          실행 취소
        </button>
        <button className={buttonStyle} onClick={redo}>
          <LuRedo2 size={24} />
          실행 복구
        </button> */}
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
            >
              <button>기타자료</button>

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
                        // style={{
                        //   padding: '4px 8px',
                        //   marginBottom: '4px',
                        //   backgroundColor: snapshot.isDragging
                        //     ? '#ddd'
                        //     : '#fff',
                        //   border: '1px solid #ccc',
                        //   borderRadius: '4px',
                        //   ...provided.draggableProps.style
                        // }}
                      >
                        {/* {item.content} */}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>

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
            >
              <button>커버</button>

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
    </div>
  );
}
