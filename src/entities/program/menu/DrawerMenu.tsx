'use client';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { IoIosAddCircle } from 'react-icons/io';
import { useState } from 'react';
import { Toolbar } from '@mui/material';
import { colors } from '@/design-tokens';
import { DrawerList } from './ui/drawList';
import { imgBox } from './userBox/index.css';
import Image from 'next/image';
export default function TemporaryDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Toolbar />
      <div>
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
            position: 'fixed', // Use 'fixed' to keep it below the drawer
            bottom: '70px', // Set the button 20px below the drawer
            left: open ? 'calc(300px + 10px)' : '10px', // Move button when the drawer opens
            transition: 'left 0.3s ease',
            color: 'black',
            padding: '10px 16px',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '20px',
              height: '12px'
            }}
          >
            <Image
              fill
              style={{
                transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 0.3s ease' // 부드러운 애니메이션 추가
              }}
              src={'/images/icons/openMenu.png'}
              alt={'유저 등급'}
            />
          </div>
          <span> {open ? '숨기기' : '열기'}</span>
        </Button>
      </div>
    </>
  );
}
