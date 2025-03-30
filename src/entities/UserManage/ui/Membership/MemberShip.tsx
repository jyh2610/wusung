'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/shared/ui';
import {
  memberShipStyle,
  titleContentStyle,
  titleStyle,
  selectContainerStyle,
  buttonStyle
} from './index.css';
import { SelectType } from './ui';

export function MemberShip() {
  const router = useRouter();

  const [selectedType, setSelectedType] = useState<string | undefined>(
    undefined
  );
  const [steps, setSteps] = useState<string | null>(null);

  const clickController = (type: string) => {
    setSelectedType(type);
  };

  const handleNavigate = (type: string | undefined) => {
    type && router.push(`/signup/${type}`);
  };

  const nextStopHandler = () => {
    setSteps(steps);
  };

  const btnColorSelector = (type: string | undefined) => {
    return type ? 'brand' : 'beforeSelection';
  };

  return (
    <div className={memberShipStyle}>
      <div>
        <p className={titleStyle}>회원가입</p>
        <p className={titleContentStyle}>
          로그인에 사용할 회원 정보를 입력해주세요
        </p>
      </div>
      <div className={selectContainerStyle}>
        <SelectType
          onClick={() => clickController('company')}
          title="법인 (사업자)"
          logo="/images/company.svg"
          selected={selectedType === 'company'}
        />
        <SelectType
          onClick={() => clickController('individual')}
          title="개인"
          logo="/images/person.svg"
          selected={selectedType === 'individual'}
        />
      </div>
      <div className={buttonStyle} onClick={nextStopHandler}>
        <Button
          content="다음"
          onClick={() => handleNavigate(selectedType)}
          type={btnColorSelector(selectedType)}
          btnSize="medium"
        />
      </div>
    </div>
  );
}
