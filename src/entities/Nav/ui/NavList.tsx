import React from 'react';
import { listFontStyle } from './NavList.css';

export function NavList({ list }: { list: string }) {
  return <div className={listFontStyle}>{list}</div>;
}
