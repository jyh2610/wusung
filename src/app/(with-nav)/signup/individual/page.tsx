import React from 'react';
import { IndividualComponent } from '@/entities';
import { inputContainer } from '../index.css';

function Individual() {
  return (
    <div className={inputContainer}>
      <IndividualComponent />
    </div>
  );
}

export default Individual;
