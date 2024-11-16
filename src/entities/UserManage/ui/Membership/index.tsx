import React from 'react';
import {
  memberShipStyle,
  titleContentStyle,
  titleStyle,
  selectContainerStyle
} from './index.css';
import { SelectType } from './ui';

export function MemberShip() {
  return (
    <div className={memberShipStyle}>
      <div>
        <p className={titleStyle}>회원가입</p>
        <p className={titleContentStyle}>
          로그인에 사용할 회원 정보를 입력해주세요
        </p>
      </div>
      <div className={selectContainerStyle}>
        <SelectType title={'법인 (사업자)'} logo={'/images/company.svg'} />
        <SelectType title={'개인'} logo={'/images/person.svg'} />
      </div>
    </div>
  );
}
