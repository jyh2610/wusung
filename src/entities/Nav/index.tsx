import React from 'react';
import { NavLists } from './const';
import {
  NavStyle,
  ListContainerStyle,
  NavListStyle,
  LogoStyle
} from './index.css';
import { NavList } from './ui';

export function Nav() {
  return (
    <div className={NavStyle}>
      <div className={ListContainerStyle}>
        <div className={LogoStyle}>LOGO</div>
        <div className={NavListStyle}>
          {NavLists.map((list, index) => (
            <NavList key={index} list={list} />
          ))}
        </div>
      </div>
    </div>
  );
}
