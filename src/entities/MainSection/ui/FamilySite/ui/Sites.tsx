import React from 'react';
import { familySiteStyle } from '../index.css';
import { siteStyle } from './index.css';

export function Sites() {
  return <div className={`${siteStyle} ${familySiteStyle}`}>Sites</div>;
}

export function Company() {
  return <div>Company</div>;
}
