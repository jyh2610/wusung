import classNames from 'classnames'; // 👈 여러 클래스를 동적으로 적용할 수 있음
import Image from 'next/image';
import React, { Dispatch, SetStateAction, useState } from 'react';
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

  const convertToRegUser = (user: IUserDetail): IRegUser => ({
    name: user.name ?? '',
    birthDate: user.birthDate ?? '',
    longTermNum: user.recipientNumber ?? '',
    certificationStart: user.certificationStart ?? '',
    certificationEnd: user.certificationEnd ?? '',
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
              {/* <Image fill src={`/images/icons/grade${user.grade}.png`} /> */}
              <Image fill src={'/images/icons/grade5.png'} alt="유저 등급" />
            </div>
            <div className={imgBox}>
              <Image fill src={'/images/icons/high.png'} alt="유저 등급" />
            </div>
          </div>
        </div>

        <div
          className={classNames(imgBox, {
            [selectedOptContainer]: isSelected
          })}
          onClick={e => {
            e.stopPropagation();
            setShowMenu(prev => !prev);
          }}
          style={{ position: 'relative' }}
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
          {showMenu && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: '#fff',
                border: '1px solid #eee',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                zIndex: 10,
                color: colors.gray_scale[800],
                minWidth: 100
              }}
            >
              <div
                style={{ padding: '10px 16px', cursor: 'pointer' }}
                onClick={e => {
                  e.stopPropagation();
                  onDetail(user);
                }}
              >
                상세
              </div>
              <div
                style={{ padding: '10px 16px', cursor: 'pointer' }}
                onClick={async e => {
                  e.stopPropagation();
                  const detail = await getUserDetail(user.elderId);
                  if (detail) {
                    setEditUser(detail);
                    setEditModalOpen(true);
                  }
                }}
              >
                수정
              </div>
              <div
                style={{
                  padding: '10px 16px',
                  cursor: 'pointer',
                  color: '#e1007b'
                }}
                onClick={e => {
                  e.stopPropagation();
                  onDelete(user);
                }}
              >
                삭제
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={roleBox}>
        <div className={imgBox}>
          <Image fill src={'/images/icons/support_agent.png'} alt="담당자" />
        </div>
        담당자
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
