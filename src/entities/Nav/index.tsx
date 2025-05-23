'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { navLists } from './const';
import { NavList } from './ui';
import { routeMap } from '@/shared/const/route';
import {
  NavStyle,
  NavInnerContainerStyle,
  TopBarStyle,
  LogoStyle,
  NavItemWrapperStyle,
  SubMenuBarStyle,
  SubMenuSpacerStyle,
  SubMenuItemStyle,
  NavContentBoxStyle
} from './index.css';
import { getRouteKey } from './utils';

export function Nav() {
  const [isNavHover, setIsNavHover] = useState(false);
  const [hoveredTitle, setHoveredTitle] = useState('');
  const router = useRouter();

  return (
    <nav className={NavStyle} onMouseLeave={() => setIsNavHover(false)}>
      <div className={NavInnerContainerStyle}>
        <div className={TopBarStyle}>
          <div className={NavContentBoxStyle}>
            <div className={LogoStyle} onClick={() => router.push('/')}>
              <Image fill src={'/images/logo.svg'} alt="logo" />
            </div>
            {navLists.map((list, index) => (
              <div
                key={index}
                className={NavItemWrapperStyle}
                onMouseEnter={() => {
                  setHoveredTitle(list.title);
                  setIsNavHover(true);
                }}
              >
                <NavList list={list} />
              </div>
            ))}
          </div>
        </div>

        {isNavHover && (
          <div className={SubMenuBarStyle}>
            <div className={NavContentBoxStyle}>
              <div className={SubMenuSpacerStyle} />
              {navLists.map((list, idx) => (
                <div key={idx} className={NavItemWrapperStyle}>
                  {list.subTitle.map((sub, subIdx) => {
                    const routeKey = getRouteKey(list.title, sub);
                    return (
                      <div
                        key={subIdx}
                        className={SubMenuItemStyle}
                        onClick={() =>
                          routeKey &&
                          router.push(
                            routeMap[routeKey as keyof typeof routeMap]
                          )
                        }
                      >
                        {sub}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
