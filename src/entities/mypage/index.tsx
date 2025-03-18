'use client';

import React, { useState } from 'react';
import { menuItems } from './const';
import { container, content } from './index.css';
import { MypageMenu } from './ui';

// 메뉴 리스트
export function MypageComponent() {
  const [selectedMenu, setSelectedMenu] = useState<string>('결재내역');

  return (
    <div className={container}>
      <MypageMenu
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
      />
      <div className={content}>
        {menuItems.find(item => item.label === selectedMenu)?.component}
      </div>
    </div>
  );
}
