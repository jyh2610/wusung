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
import { IUser } from '../../type.dto';

interface IProps {
  user: IUser;
  isSelected: boolean;
  onSelect: () => void;
}

export function UserBox({ user, isSelected, onSelect }: IProps) {
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
      </div>

      <div className={roleBox}>
        <div className={imgBox}>
          <Image fill src={'/images/icons/support_agent.png'} alt="담당자" />
        </div>
        담당자
      </div>
    </div>
  );
}
