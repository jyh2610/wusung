import React from 'react';
import { INaviList } from '../const';
import { listFontStyle } from './NavList.css';

export function NavList({
  list,
  isNavHover
}: {
  list: INaviList;
  isNavHover: boolean;
}) {
  return <div className={listFontStyle}>{list.title}</div>;
}
