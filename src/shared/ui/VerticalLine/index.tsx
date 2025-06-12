import React from 'react';
import { horizontalLine, verticalLineBase } from './index.css';

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

export function HorizontalLine({
  width = '100px',
  thickness = '2px',
  color = 'black'
}) {
  return (
    <div
      className={horizontalLine}
      style={{
        height: thickness,
        width: width,
        backgroundColor: color
      }}
    />
  );
}
