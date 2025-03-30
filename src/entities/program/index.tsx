'use client';

import { DragDropContext, DragUpdate, DropResult } from '@hello-pangea/dnd';
import React, { useState } from 'react';
import { ActivityList } from './activityList';
import { Scheduler } from './scheduler';
import { colors } from '@/design-tokens';
interface Schedule {
  [key: number]: {
    cognitive?: string;
    daily?: string;
  };
}
const initialActivities = [
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
export function ProgramComponent() {
  const [schedule, setSchedule] = useState<Schedule>({});
  const [activities, setActivities] = useState(initialActivities);

  console.log(schedule);
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const [numberStr, content] = draggableId.split('|');
    const number = Number(numberStr); // 숫자로 변환

    if (!number || !content) return;

    const draggedItem = { number, content }; // number와 content를 객체로 저장

    if (destination.droppableId === 'activityList') {
      // 원래 리스트로 복귀
      setActivities(prev => [...prev, draggedItem]);

      // 스케줄에서 제거
      setSchedule(prev => {
        const newSchedule = { ...prev };
        Object.keys(newSchedule).forEach(day => {
          if (newSchedule[Number(day)]?.cognitive === content) {
            delete newSchedule[Number(day)].cognitive;
          }
          if (newSchedule[Number(day)]?.daily === content) {
            delete newSchedule[Number(day)].daily;
          }
        });
        return newSchedule;
      });
    } else {
      // 스케줄에 배치
      const [dayNum, category] = destination.droppableId.split('-');
      const day = Number(dayNum);

      setSchedule(prev => ({
        ...prev,
        [day]: { ...prev[day], [category]: content }
      }));
    }
  };

  const onDragUpdate = (update: DragUpdate) => {
    const { destination } = update;

    if (destination) {
      const droppableId = destination.droppableId;
      const droppableElement = document.getElementById(droppableId);

      if (droppableElement) {
        // 스크롤이 필요한 경우 자동으로 이동
        droppableElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
      <div
        style={{
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ flexGrow: 1, overflowY: 'auto' }}>
          <ActivityList activities={activities} />
          <Scheduler schedule={schedule} />
        </div>
      </div>
    </DragDropContext>
  );
}
