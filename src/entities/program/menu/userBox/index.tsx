import classNames from 'classnames'; // 👈 여러 클래스를 동적으로 적용할 수 있음
import Image from 'next/image';
import React, {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useRef
} from 'react';
import {
  container,
  selectedContainer,
  imgBox,
  imgContainer,
  title,
  userInfo,
  userNumber,
  userName,
  roleBox,
  selectedOptContainer
} from './index.css';
import { IRegUser, IUser, IUserDetail } from '../../type.dto';
import { AddUser } from '../../addUser';
import { getUserDetail } from '../../api';
import { colors } from '@/design-tokens';
import { DifficultyBadge, GradeCircle } from './GradeCircle';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';

interface IProps {
  user: IUser;
  isSelected: boolean;
  onSelect: () => void;
  onDetail: (user: IUser) => void;
  onEdit: (user: IUser) => void;
  onDelete: (user: IUser) => void;
}

export function UserBox({
  user,
  isSelected,
  onSelect,
  onDetail,
  onEdit,
  onDelete
}: IProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<IUserDetail | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(`UserBox ${user.elderId} 선택 상태:`, isSelected);
  }, [isSelected, user.elderId]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const convertToRegUser = (user: IUserDetail): IRegUser => ({
    elderId: user.elderId,
    name: user.name ?? '',
    birthDate: formatDate(user.birthDate ?? ''),
    longTermNum: user.recipientNumber ?? '',
    certificationStart: formatDate(user.certificationStart ?? ''),
    certificationEnd: formatDate(user.certificationEnd ?? ''),
    servicer: user.managerName ?? '',
    difficulty: user.difficultyLevel ? String(user.difficultyLevel) : '',
    grade: user.disabilityGrade ? String(user.disabilityGrade) : ''
  });

  return (
    <div
      className={classNames(container, { [selectedContainer]: isSelected })}
      onClick={onSelect}
    >
      <div className={title}>
        <div className={userInfo}>
          <span className={userNumber}>{user.elderId}</span>
          <span className={userName}>{user.name}</span>

          <div className={imgContainer}>
            <div className={imgBox}>
              <GradeCircle grade={Number(user.disabilityGrade)} />
            </div>
            <div className={imgBox}>
              <DifficultyBadge level={Number(user.difficultyLevel)} />
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className={classNames(imgBox, {
                [selectedOptContainer]: isSelected
              })}
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={e => e.stopPropagation()}
            >
              <Image
                fill
                src={
                  isSelected
                    ? '/images/icons/selectOpt.png'
                    : '/images/icons/opt.png'
                }
                alt="유저 선택됨"
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start">
            <DropdownMenuItem onClick={() => onDetail(user)}>
              상세
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                const detail = await getUserDetail(user.elderId);
                if (detail) {
                  setEditUser(detail);
                  setEditModalOpen(true);
                }
              }}
            >
              수정
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(user)}
              style={{ color: '#e1007b' }}
            >
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className={roleBox}>
        <div className={imgBox}>
          <Image fill src={'/images/icons/support_agent.png'} alt="담당자" />
        </div>
        담당자 {user.managerName}
      </div>

      <AddUser
        open={editModalOpen}
        closeModal={() => setEditModalOpen(false)}
        defaultValue={editUser ? convertToRegUser(editUser) : undefined}
        mode="edit"
      />
    </div>
  );
}
