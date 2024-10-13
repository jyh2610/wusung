import React from 'react';
import { verticalLineBase } from './index.css';

export function VerticalLine({
  height = '100px',
  thickness = '2px',
  color = 'black'
}) {
  return (
    <div
      className={verticalLineBase}
      style={{
        height: height,
        width: thickness,
        backgroundColor: color
      }}
    />
  );
}
