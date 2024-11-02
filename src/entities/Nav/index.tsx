'use client';

import Image from 'next/image';
import { useState } from 'react';
import { navLists } from './const';
import {
  NavStyle,
  ListContainerStyle,
  NavListStyle,
  LogoStyle
} from './index.css';
import { NavList } from './ui';

export function Nav() {
  const [isNavHover, setIsNavHover] = useState(false);
  return (
    <nav className={NavStyle}>
      <div className={ListContainerStyle}>
        <div className={LogoStyle}>
          <Image fill src={'/images/logo.svg'} alt={'logo'} />
        </div>
        <div
          className={NavListStyle}
          onMouseEnter={() => setIsNavHover(true)}
          onMouseLeave={() => setIsNavHover(false)}
        >
          {navLists.map((list, index) => (
            <NavList key={index} isNavHover={isNavHover} list={list} />
          ))}
        </div>
      </div>
    </nav>
  );
}
