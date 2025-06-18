'use client';

import React, { useState, useEffect } from 'react';
import { menuItems } from './const';
import { container, content } from './index.css';
import { MypageMenu } from './ui';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

// 메뉴 리스트
export function MypageComponent() {
  const [selectedMenu, setSelectedMenu] = useState<string>('결제내역');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && menuItems.some(item => item.label === tab)) {
      setSelectedMenu(tab);
    }
  }, [searchParams]);


const handleMenuClick = (menu: string) => {
  setSelectedMenu(menu);
  router.push(`/mypage?tab=${menu}`);
};

  return (
    <div className={container}>
      <MypageMenu
        selectedMenu={selectedMenu}
        setSelectedMenu={handleMenuClick}
      />
      <div className={content}>
        {menuItems.find(item => item.label === selectedMenu)?.component}
      </div>
    </div>
  );
}
