'use client';

import { DragDropContext } from '@hello-pangea/dnd';
import React, { useState } from 'react';
import { ActivityList } from './activityList';
import { useActivities } from './scheduler/model/useActivities';
import { useDragAndDrop } from './scheduler/model/useDragAndDrop';
import { SchedulerLayout } from './scheduler';
import { useIsAdmin } from '@/components/hooks/useIsAdmin';
import { useScheduleStore } from '@/shared/stores/useScheduleStore';
import { scrollHidden } from './scheduler/index.css';

export function ProgramComponent() {
  const isAdmin = useIsAdmin();
  const { schedule } = useScheduleStore();

  const [categoryId, setCategoryId] = useState<number>(1);
  const [difficultyLevel, setDifficultyLevel] = useState<number>(2);

  const { activities, setActivities } = useActivities({
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
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          style={{
            flexGrow: 1,
            maxHeight: '1800px',
            position: 'relative',
            overflowY: 'auto'
          }}
        >
          <ActivityList
            isAdmin={isAdmin}
            activities={activities}
            onFilterChange={handleFilterChange}
          />
          <SchedulerLayout schedule={schedule} isAdmin={isAdmin} />
        </div>
      </div>
    </DragDropContext>
  );
}
