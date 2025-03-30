import React from 'react';
import { container } from './index.css';
import { Calendar } from './ui/calender';
import { Control } from './ui/control';
import Header from './ui/header';

interface Schedule {
  [key: number]: {
    cognitive?: string;
    daily?: string;
  };
}

interface CalendarProps {
  schedule: Schedule;
}

export function Scheduler({ schedule }: CalendarProps) {
  return (
    <div className={container}>
      <Header />
      <Control />
      <Calendar schedule={schedule} />
    </div>
  );
}
