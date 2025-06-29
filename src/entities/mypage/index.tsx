'use client';

import React, { useState, useEffect } from 'react';
import { menuItems, getFilteredMenuItems } from './const';
import { container, content } from './index.css';
import { MypageMenu } from './ui';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getUserType } from './api';

// 메뉴 리스트
export function MypageComponent() {
  const [selectedMenu, setSelectedMenu] = useState<string>('결제내역');
  const searchParams = useSearchParams();
  const router = useRouter();

  const { data: userTypeResponse } = useQuery({
    queryKey: ['userType'],
    queryFn: getUserType
  });

  // 유저 타입에 따라 필터링된 메뉴 아이템
  const filteredMenuItems = getFilteredMenuItems(
    userTypeResponse?.data?.UserType || '개인'
  );

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && filteredMenuItems.some(item => item.label === tab)) {
      setSelectedMenu(tab);
    } else if (!filteredMenuItems.some(item => item.label === selectedMenu)) {
      // 현재 선택된 메뉴가 필터링된 메뉴에 없으면 첫 번째 메뉴로 설정
      setSelectedMenu(filteredMenuItems[0]?.label || '결제내역');
    }
  }, [searchParams, filteredMenuItems, selectedMenu]);

  const handleMenuClick = (menu: string) => {
    setSelectedMenu(menu);
    router.push(`/mypage?tab=${menu}`);
  };

  return (
    <div className={container}>
      <MypageMenu
        selectedMenu={selectedMenu}
        setSelectedMenu={handleMenuClick}
        menuItems={filteredMenuItems}
      />
      <div className={content}>
        {filteredMenuItems.find(item => item.label === selectedMenu)?.component}
      </div>
    </div>
  );
}
