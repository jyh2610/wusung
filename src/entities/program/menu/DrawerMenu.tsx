'use client';

import { Toolbar } from '@mui/material';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Image from 'next/image';
import { useState } from 'react';
import { colors } from '@/design-tokens';
import { DrawerList } from './ui/drawList';
import { AddUser } from '../addUser';

export default function TemporaryDrawer() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Toolbar />

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          position: 'fixed',
          top: '70px',
          left: 0,
          width: '300px', // ⭐ 항상 300px 유지
          height: '100vh',
          transition: 'transform 0.3s ease',
          transform: open ? 'translateX(0)' : 'translateX(-100%)', // ⭐ 내부 이동으로 숨김 처리
          '& .MuiDrawer-paper': {
            backgroundColor: colors.bg,
            boxSizing: 'border-box',
            boxShadow: 'none',
            border: 'none',
            padding: '0 24px',
            width: '300px', // ⭐ Drawer 크기 고정
            position: 'fixed'
          }
        }}
        variant="persistent"
        anchor="left"
      >
        {/* ⭐ DrawerList 내용 숨기기 */}
        <div style={{ display: open ? 'block' : 'none' }}>
          <DrawerList open={open} setOpen={setOpen} />
        </div>
      </Drawer>

      {/* 🛠 버튼도 고정 */}
      <Button
        onClick={() => setOpen(!open)}
        sx={{
          position: 'fixed',
          top: 'calc(50vh + 10px)',
          left: open ? '270px' : '10px', // Drawer 열릴 때 위치 조정
          transition: 'left 0.3s ease',
          color: 'black',
          padding: '10px 16px',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '5px',
          zIndex: 1100
        }}
      >
        <div style={{ width: '25px', height: '14px', position: 'relative' }}>
          <Image
            fill
            style={{
              transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.3s ease'
            }}
            src={'/images/icons/openMenu.png'}
            alt={'유저 등급'}
          />
        </div>
      </Button>
    </>
  );
}
