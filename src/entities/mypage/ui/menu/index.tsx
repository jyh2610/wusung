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
export function MypageMenu({
  selectedMenu,
  setSelectedMenu
}: {
  selectedMenu: string;
  setSelectedMenu: React.Dispatch<React.SetStateAction<string>>;
}) {
  const id = 'test';
  const limitDate = '2022-01-01';
  return (
    <div className={container}>
      {/* <div className={menuContainer}>
        <div className={infoBox}>
          <span
            style={{
              fontWeight: '600',
              fontSize: '24px',
              lineHeight: '28.64px',
              letterSpacing: '-2.5%',
              color: '#444444'
            }}
          >
            {id}
          </span>
          님,
          <br />
          오늘도 좋은 하루 되세요!
        </div>
        <div className={useDateBox}>
          <p className={useDateTitle}>우성인지펜 사용 중</p>
          <p className={useDateDuration}>사용기한:~{limitDate}</p>
        </div>
        <div style={{ paddingTop: '8px' }}>
          <Button content="로그아웃" type="default" />
        </div>
      </div> */}

      <Logged />

      {/* 사이드 메뉴 */}
      <div className={menuListContainer}>
        <ul>
          {menuItems.map(({ label, icon }) => (
            <ListComponent
              key={label}
              icon={icon}
              label={label}
              isSelected={selectedMenu === label}
              onClick={setSelectedMenu}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
