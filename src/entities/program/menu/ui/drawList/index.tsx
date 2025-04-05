'use client';

import { Box } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { IoIosAddCircle } from 'react-icons/io';
import { colors } from '@/design-tokens';
import { titleContainer, title } from '../../index.css';
import { UserBox } from '../../userBox';
import { SearchBar } from '../serachBar';
import { useBoxContainer } from './index.css';
import { AddUser } from '@/entities/program/addUser';
import { getUser } from '@/entities/program/api';
import { useUserStore } from '@/shared/stores/useUserStore';

interface IProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DrawerList = ({ open, setOpen }: IProps) => {
  const [openAddUser, setOpenUser] = useState(false);

  const users = useUserStore(state => state.users);
  const setUsers = useUserStore(state => state.setUsers);
  const selectedUserId = useUserStore(state => state.selectedUserId);
  const selectUser = useUserStore(state => state.selectUser);

  const closeModal = () => setOpenUser(false);

  useEffect(() => {
    const getUserHandler = async () => {
      try {
        const res = await getUser();
        setUsers(res || []);
      } catch (error) {
        console.error('유저 불러오기 실패:', error);
      }
    };
    getUserHandler();
  }, []);

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
          color={colors.brand[400]}
          onClick={() => {
            setOpenUser(true);
            setOpen(false);
          }}
        />
      </div>

      <SearchBar />

      <div className={useBoxContainer}>
        {users.map(item => (
          <UserBox
            key={item.elderId}
            user={item}
            isSelected={selectedUserId === item.elderId}
            onSelect={() => selectUser(item.elderId)}
          />
        ))}
      </div>

      <AddUser open={openAddUser} closeModal={closeModal} />
    </Box>
  );
};
