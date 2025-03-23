import React from 'react';
import Header from './ui/header';
import { container } from './index.css';
import { Control } from './ui/control';
import { Calendar } from './ui/calender';

export function Scheduler() {
  return (
    <div className={container}>
      <Header />
      <Control />
      <Calendar month={'3'} daysInMonth={1} />
    </div>
  );
}
