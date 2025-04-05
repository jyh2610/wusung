'use client';

import { DragDropContext } from '@hello-pangea/dnd';
import React, { useState } from 'react';
import { ActivityList } from './activityList';
import { useActivities } from './scheduler/model/useActivities';
import { useDragAndDrop } from './scheduler/model/useDragAndDrop';
import { SchedulerLayout } from './scheduler';
import { useIsAdmin } from '@/components/hooks/useIsAdmin';
import { useScheduleStore } from '@/shared/stores/useScheduleStore';

export function ProgramComponent() {
  const isAdmin = useIsAdmin();
  const { schedule, updateSchedule, undo, redo } = useScheduleStore();

  const [categoryId, setCategoryId] = useState<number>(1);
  const [difficultyLevel, setDifficultyLevel] = useState<number>(2); // medium 기본값

  const { activities, fetchActivities, setActivities } = useActivities({
    isAdmin,
    categoryId,
    difficultyLevel
  });

  const { onDragEnd, onDragUpdate } = useDragAndDrop(activities, setActivities);

  const handleFilterChange = (categoryId: number, difficultyLevel: number) => {
    setCategoryId(categoryId);
    setDifficultyLevel(difficultyLevel);
  };

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
          <ActivityList
            activities={activities}
            onFilterChange={handleFilterChange}
          />
          <SchedulerLayout schedule={schedule} isAdmin={isAdmin} />
        </div>
      </div>
    </DragDropContext>
  );
}
