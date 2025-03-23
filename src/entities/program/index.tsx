import React from 'react';
import { ActivityList } from './activityList';
import { Scheduler } from './scheduler';

export function ProgramComponent() {
  return (
    <div>
      <ActivityList />
      <Scheduler />
    </div>
  );
}
