import React from 'react';
import { container } from './index.css';
import { Calendar } from './ui/calender';
import { Control } from './ui/control';
import Header from './ui/header';
import { Schedule } from '../type.dto';

interface Props {
  isAdmin: boolean;
  schedule: Schedule;
}

export function SchedulerLayout({ schedule, isAdmin }: Props) {
  return (
    <div className={container}>
      <Header isAdmin={isAdmin} schedule={schedule} />
      <Control isAdmin={isAdmin} />
      <Calendar isAdmin={isAdmin} schedule={schedule} />
    </div>
  );
}
