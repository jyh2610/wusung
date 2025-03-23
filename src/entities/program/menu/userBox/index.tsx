import React, { Dispatch, SetStateAction, useState } from 'react';
import classNames from 'classnames'; // 👈 여러 클래스를 동적으로 적용할 수 있음
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
import Image from 'next/image';

interface IProps {
  isSelected: boolean;
  setIsSelected: Dispatch<SetStateAction<boolean>>;
}

export function UserBox({ isSelected, setIsSelected }: IProps) {
  const handleSelect = () => {
    setIsSelected(!isSelected);
  };

  return (
    <div
      className={classNames(container, { [selectedContainer]: isSelected })}
      onClick={handleSelect} // 클릭 시 상태 변경
    >
      <div className={title}>
        <div className={userInfo}>
          <span className={userNumber}>1</span>
          <span className={userName}>김철수</span>

          <div className={imgContainer}>
            <div className={imgBox}>
              <Image fill src={'/images/icons/grade5.png'} alt={'유저 등급'} />
            </div>
            <div className={imgBox}>
              <Image fill src={'/images/icons/high.png'} alt={'유저 등급'} />
            </div>
          </div>
        </div>

        {/* ✅ 선택되었을 때만 표시 */}
        <div
          className={classNames(imgBox, { [selectedOptContainer]: isSelected })}
        >
          {isSelected ? (
            <Image
              fill
              src={'/images/icons/selectOpt.png'}
              alt={'유저 선택됨'}
            />
          ) : (
            <Image fill src={'/images/icons/opt.png'} alt={'유저 선택됨'} />
          )}
        </div>
      </div>

      <div className={roleBox}>
        <div className={imgBox}>
          <Image
            fill
            src={'/images/icons/support_agent.png'}
            alt={'유저 등급'}
          />
        </div>
        담당자
      </div>
    </div>
  );
}
