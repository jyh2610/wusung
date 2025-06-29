'use client';

import { useState } from 'react';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { FaUserCog, FaCog } from 'react-icons/fa';
import { IoReceiptOutline } from 'react-icons/io5';
import { Button } from '@/shared/ui';
import { menuItems } from '../../const';
import {
  PaymentHistory,
  InquiryHistory,
  ManagerSettings,
  ProfileEdit
} from '../Content';
import {
  container,
  infoBox,
  menuContainer,
  menuListContainer,
  useDateBox,
  useDateDuration,
  useDateTitle
} from './index.css';
import { ListComponent } from './ListComponent';
import Logged from '@/entities/MainBanner/ui/Login/Logged';

interface MenuItem {
  label: string;
  icon: React.ReactElement;
  component: React.ReactElement;
}

export function MypageMenu({
  selectedMenu,
  setSelectedMenu,
  menuItems: customMenuItems
}: {
  selectedMenu: string;
  setSelectedMenu: (menu: string) => void;
  menuItems?: MenuItem[];
}) {
  const itemsToRender = customMenuItems || menuItems;

  return (
    <div className={container}>
      <Logged />

      {/* 사이드 메뉴 */}
      <div className={menuListContainer}>
        <ul>
          {itemsToRender.map(({ label, icon }) => (
            <ListComponent
              key={label}
              icon={icon}
              label={label}
              isSelected={selectedMenu === label}
              onClick={() => setSelectedMenu(label)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
