'use client';

import { Box } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { IoIosAddCircle } from 'react-icons/io';
import { colors } from '@/design-tokens';
import { titleContainer, title } from '../../index.css';
import { UserBox } from '../../userBox';
import { getUser } from '@/entities/program/api';
import { useUserStore } from '@/shared/stores/useUserStore';
import { useCategoryStore } from '@/shared/stores/useCategoryStore';
import { ActivityBox } from './activityBox';
import { AddUser } from '@/entities/program/addUser';
import { useBoxContainer } from './index.css';
import { usePathname } from 'next/navigation';

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

  // Use usePathname hook from next/navigation to get the current route
  const pathname = usePathname();

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
      {/* Conditionally render ActivityBox if the current path is '/program' */}
      {pathname === '/program' ? (
        <>
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
        </>
      ) : (
        <ActivityBox />
      )}
    </Box>
  );
};
