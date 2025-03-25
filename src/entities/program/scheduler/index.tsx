import React from 'react';
import { container } from './index.css';
import { Calendar } from './ui/calender';
import { Control } from './ui/control';
import Header from './ui/header';

export function Scheduler() {
  return (
    <div className={container}>
      <Header />
      <Control />
      <Calendar />
    </div>
  );
}
