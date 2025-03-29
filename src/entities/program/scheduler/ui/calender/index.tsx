'use client';

import { Droppable } from '@hello-pangea/dnd';
import { useState } from 'react';
import {
  container,
  grid,
  gridItem,
  weekLabel,
  highlighted,
  redText,
  blueText,
  activityRow,
  activityCell,
  activityLabel,
  weekDay
} from './index.css';
interface Schedule {
  [key: number]: {
    cognitive?: string;
    daily?: string;
  };
}

interface CalendarProps {
  schedule: Schedule;
}

export function Calendar({ schedule }: CalendarProps) {
  const today = new Date();
  const year = today.getFullYear();
  const monthIndex = today.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startDay = new Date(year, monthIndex, 1).getDay();

  const weeks: number[][] = [];
  let currentWeek: number[] = new Array(startDay).fill(0);

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(0);
    }
    weeks.push(currentWeek);
  }

  return (
    <div className={container}>
      {weeks.map((week, weekIdx) => (
        <div key={weekIdx}>
          <div className={grid}>
            <div className={`${gridItem} ${weekLabel}`}>{weekIdx + 1}주차</div>
            {week.map((dayNum, i) => (
              <div key={i} className={gridItem}>
                {dayNum > 0 ? String(dayNum).padStart(2, '0') : ''}
              </div>
            ))}
          </div>

          <div className={activityRow}>
            <div className={activityCell}>
              <div className={activityLabel}>인지활동</div>
            </div>
            {week.map((dayNum, i) => (
              <Droppable
                key={i}
                droppableId={`${dayNum}-cognitive`}
                isDropDisabled={dayNum === 0}
              >
                {provided => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={activityCell}
                  >
                    {dayNum > 0 && schedule[dayNum]?.cognitive
                      ? schedule[dayNum].cognitive
                      : '-'}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>

          <div className={activityRow}>
            <div className={activityCell}>
              <div className={activityLabel}>일상생활 활동 & 추가 인지활동</div>
            </div>
            {week.map((dayNum, i) => (
              <Droppable
                key={i}
                droppableId={`${dayNum}-daily`}
                isDropDisabled={dayNum === 0}
              >
                {provided => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={activityCell}
                  >
                    {dayNum > 0 && schedule[dayNum]?.daily
                      ? schedule[dayNum].daily
                      : '-'}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
