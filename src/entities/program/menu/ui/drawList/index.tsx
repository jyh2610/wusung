'use client';

import { Box } from '@mui/material';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { IoIosAddCircle } from 'react-icons/io';
import { colors } from '@/design-tokens';
import { titleContainer, title } from '../../index.css';
import { UserBox } from '../../userBox';
import { getUser, getUserDetail, deleteUser } from '@/entities/program/api';
import { useUserStore } from '@/shared/stores/useUserStore';
import { ActivityBox } from './activityBox';
import { AddUser } from '@/entities/program/addUser';
import { useBoxContainer } from './index.css';
import { usePathname } from 'next/navigation';
import Modal from '@mui/material/Modal';
import { IRegUser, IUser, IUserDetail } from '@/entities/program/type.dto';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface IProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DrawerList = ({ open, setOpen }: IProps) => {
  const [openAddUser, setOpenUser] = useState(false);
  const [detailUser, setDetailUser] = useState<IUser | null>(null);
  const [editUser, setEditUser] = useState<IUser | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const selectedUserId = useUserStore(state => state.selectedUserId);
  const selectUser = useUserStore(state => state.selectUser);
  const setUsers = useUserStore(state => state.setUsers);

  useEffect(() => {
    console.log('현재 선택된 유저 ID:', selectedUserId);
  }, [selectedUserId]);

  const closeModal = () => setOpenUser(false);

  const pathname = usePathname();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUser
  });

  // users 데이터가 변경될 때마다 useUserStore에 저장
  useEffect(() => {
    if (users.length > 0) {
      setUsers(users);
    }
  }, [users, setUsers]);

  const handleUserSelect = (userId: number) => {
    console.log('유저 선택됨:', userId);
    selectUser(userId);
  };

  const deleteUserMutation = useMutation({
    mutationFn: (elderId: number) => deleteUser(elderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  // 상세보기
  const handleDetail = async (user: IUser) => {
    const detail = await getUserDetail(user.elderId);
    if (detail) {
      setDetailUser(detail);
      setDetailModalOpen(true);
    }
  };

  // 수정
  const handleEdit = (user: IUser) => {
    setEditUser(user);
    setEditModalOpen(true);
  };

  // 삭제
  const handleDelete = async (user: IUser) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      deleteUserMutation.mutate(user.elderId);
    }
  };

  if (isLoading) {
    return <div>로딩중...</div>;
  }

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
              }}
            />
          </div>

          <div className={useBoxContainer}>
            {users.map(item => (
              <UserBox
                key={item.elderId}
                user={item}
                isSelected={selectedUserId === item.elderId}
                onSelect={() => handleUserSelect(item.elderId)}
                onDetail={handleDetail}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <AddUser
            open={openAddUser}
            closeModal={closeModal}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ['users'] });
            }}
          />
        </>
      ) : (
        <ActivityBox />
      )}

      {/* 상세 모달 */}
      <UserDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        user={detailUser as IUserDetail}
      />

      {/* 수정 모달 (기존 AddUser 컴포넌트 재사용) */}
      <AddUser
        open={editModalOpen}
        closeModal={() => setEditModalOpen(false)}
        defaultValue={editUser as unknown as IRegUser}
        mode="edit"
        // onSubmit={...} 등 props 추가
      />
    </Box>
  );
};

export function UserDetailModal({
  open,
  onClose,
  user
}: {
  open: boolean;
  onClose: () => void;
  user: IUserDetail | null;
}) {
  const difficultyMap: Record<number, string> = {
    1: '상',
    2: '중',
    3: '하'
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#fff',
          padding: '40px 32px',
          borderRadius: 20,
          minWidth: 400,
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          outline: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {user ? (
          <>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>
              상세정보
            </h2>
            <div
              style={{
                width: '100%',
                maxWidth: 320,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                alignItems: 'flex-start'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginBottom: 8
                }}
              >
                <div style={{ color: '#888', fontSize: 14 }}>이름</div>
                <div style={{ fontWeight: 500 }}>{user.name}</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginBottom: 8
                }}
              >
                <div style={{ color: '#888', fontSize: 14 }}>생년월일</div>
                <div style={{ fontWeight: 500 }}>{user.birthDate}</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginBottom: 8
                }}
              >
                <div style={{ color: '#888', fontSize: 14 }}>
                  장기요양인정번호
                </div>
                <div style={{ fontWeight: 500 }}>{user.recipientNumber}</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginBottom: 8
                }}
              >
                <div style={{ color: '#888', fontSize: 14 }}>요양등급</div>
                <div style={{ fontWeight: 500 }}>{user.disabilityGrade}</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginBottom: 8
                }}
              >
                <div style={{ color: '#888', fontSize: 14 }}>난이도</div>
                <div style={{ fontWeight: 500 }}>
                  {difficultyMap[user.difficultyLevel] || user.difficultyLevel}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginBottom: 8
                }}
              >
                <div style={{ color: '#888', fontSize: 14 }}>담당자</div>
                <div style={{ fontWeight: 500 }}>{user.managerName}</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginBottom: 8
                }}
              >
                <div style={{ color: '#888', fontSize: 14 }}>
                  인정유효기간(시작)
                </div>
                <div style={{ fontWeight: 500 }}>{user.certificationStart}</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginBottom: 8
                }}
              >
                <div style={{ color: '#888', fontSize: 14 }}>
                  인정유효기간(종료)
                </div>
                <div style={{ fontWeight: 500 }}>{user.certificationEnd}</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginBottom: 8
                }}
              >
                <div style={{ color: '#888', fontSize: 14 }}>생성일</div>
                <div style={{ fontWeight: 500 }}>{user.createdAt}</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%'
                }}
              >
                <div style={{ color: '#888', fontSize: 14 }}>수정일</div>
                <div style={{ fontWeight: 500 }}>{user.updatedAt}</div>
              </div>
            </div>
          </>
        ) : (
          <div>로딩중...</div>
        )}
      </div>
    </Modal>
  );
}
