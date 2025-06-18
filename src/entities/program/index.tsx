'use client';

import { DragDropContext } from '@hello-pangea/dnd';
import React, { useState, useEffect } from 'react';
import { ActivityList } from './activityList';
import { useActivities } from './scheduler/model/useActivities';
import { useDragAndDrop } from './scheduler/model/useDragAndDrop';
import { SchedulerLayout } from './scheduler';
import { useIsAdmin } from '@/components/hooks/useIsAdmin';
import { useScheduleStore } from '@/shared/stores/useScheduleStore';
import { scrollHidden } from './scheduler/index.css';

export function ProgramComponent() {
  const isAdmin = useIsAdmin();
  const { schedule, reInit } = useScheduleStore();
  useEffect(() => {
    return () => {
      reInit();
    };
  }, [reInit]);

  const [categoryId, setCategoryId] = useState<number>(1);
  const [difficultyLevel, setDifficultyLevel] = useState<number>(2);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);

  const { activities, setActivities, totalElements, totalPages } =
    useActivities({
      isAdmin,
      categoryId,
      difficultyLevel,
      page: currentPage,
      size: pageSize
    });

  const { onDragEnd, onDragUpdate, onDragStart } = useDragAndDrop(
    activities,
    setActivities
  );

  const handleFilterChange = (
    categoryId: number,
    difficultyLevel: number,
    page?: number,
    size?: number
  ) => {
    setCategoryId(categoryId);
    setDifficultyLevel(difficultyLevel);
    if (page !== undefined) {
      setCurrentPage(page);
    }
    if (size !== undefined) {
      setPageSize(size);
    }
  };

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragUpdate={onDragUpdate}
      onDragStart={onDragStart}
    >
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
            totalElements={totalElements}
            totalPages={totalPages}
            currentPage={currentPage}
            pageSize={pageSize}
          />
          <SchedulerLayout schedule={schedule} isAdmin={isAdmin} />
        </div>
      </div>
    </DragDropContext>
  );
}
