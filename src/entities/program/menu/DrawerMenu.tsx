'use client';

import { Toolbar } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Image from 'next/image';
import { useState } from 'react';
import { IoIosAddCircle } from 'react-icons/io';
import { colors } from '@/design-tokens';
import { DrawerList } from './ui/drawList';
import { imgBox } from './userBox/index.css';

export default function TemporaryDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Toolbar />
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          position: 'absolute',
          flexShrink: 0,
          zIndex: 10,
          width: open ? 300 : 0,
          transition: 'width 0.3s ease',
          '& .MuiDrawer-paper': {
            backgroundColor: colors.bg,
            boxSizing: 'border-box',
            top: '70px',
            height: '50vh',
            boxShadow: 'none',
            border: 'none',
            padding: '0 24px',
            width: open ? 300 : 0
          }
        }}
        variant="persistent"
        anchor="left"
      >
        <DrawerList open={open} setOpen={setOpen} />
      </Drawer>

      <Button
        onClick={() => setOpen(!open)}
        sx={{
          position: 'absolute',
          top: 'calc(50vh + 10px)', // Drawer 아래쪽에 위치
          left: open ? 'calc(250px - 50px)' : '10px', // 닫힐 때 왼쪽으로 이동
          transition: 'left 0.3s ease',
          color: 'black',
          padding: '10px 16px',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '5px', // 이미지와 텍스트 간격 추가
          zIndex: 1000
        }}
      >
        <div
          style={{
            width: '20px',
            height: '12px',
            position: 'relative' // fixed 제거하여 정렬 유지
          }}
        >
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
        <span>{open ? '숨기기' : '열기'}</span>
      </Button>
    </>
  );
}
