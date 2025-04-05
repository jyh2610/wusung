// 📌 components/ProgramComponent.tsx
'use client';

import { DragDropContext } from '@hello-pangea/dnd';
import React from 'react';
import { ActivityList } from './activityList';
import { useActivities } from './scheduler/model/useActivities';
import { useDragAndDrop } from './scheduler/model/useDragAndDrop';
import { SchedulerLayout } from './scheduler';
import { useIsAdmin } from '@/components/hooks/useIsAdmin';
import { useScheduleStore } from '@/shared/stores/useScheduleStore';

export function ProgramComponent() {
  const isAdmin = useIsAdmin();
  const { schedule, updateSchedule, undo, redo } = useScheduleStore(); // ✅ Zustand 스토어에서 상태 가져오기
  const { activities, setActivities } = useActivities();
  const { onDragEnd, onDragUpdate } = useDragAndDrop(activities, setActivities);

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
      <div
        style={{
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ flexGrow: 1, overflowY: 'auto' }}>
          <ActivityList activities={activities} />
          <SchedulerLayout schedule={schedule} isAdmin={isAdmin} />
        </div>
      </div>
    </DragDropContext>
  );
}
