'use client';

import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import React, { useState } from 'react';
import { ActivityList } from './activityList';
import { Scheduler } from './scheduler';
interface Schedule {
  [key: number]: {
    cognitive?: string;
    daily?: string;
  };
}

export function ProgramComponent() {
  const [schedule, setSchedule] = useState<Schedule>({});

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const [dayNum, category] = result.destination.droppableId.split('-');
    const activity = result.draggableId;
    const day = Number(dayNum);

    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [category]: activity }
    }));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div>
        <ActivityList />
        <Scheduler schedule={schedule} />
      </div>
    </DragDropContext>
  );
}
