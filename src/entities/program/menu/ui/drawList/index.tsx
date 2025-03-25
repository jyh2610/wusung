'use client';

import { Box } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import { IoIosAddCircle } from 'react-icons/io';
import { colors } from '@/design-tokens';
import { titleContainer, title } from '../../index.css';
import { UserBox } from '../../userBox';
import { SearchBar } from '../serachBar';
import { useBoxContainer } from './index.css';

interface IProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DrawerList = ({ open, setOpen }: IProps) => {
  const [select, setIsSelected] = useState(false);

  return (
    <Box
      sx={{
        width: 250,
        marginTop: '32px',
        display: 'flex',
        flexDirection: 'column'
      }}
      role="presentation"
    >
      <div className={titleContainer}>
        <h1 className={title}>대상자 목록</h1>
        <IoIosAddCircle
          size={30}
          scale={100}
          color={colors.brand[400]}
          onClick={() => setOpen(false)}
        />
      </div>

      <SearchBar />

      <div className={useBoxContainer}>
        <UserBox isSelected={select} setIsSelected={setIsSelected} />
        <UserBox isSelected={select} setIsSelected={setIsSelected} />
        <UserBox isSelected={select} setIsSelected={setIsSelected} />
      </div>
    </Box>
  );
};
