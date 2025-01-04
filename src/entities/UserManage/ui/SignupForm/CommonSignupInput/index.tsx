import React from 'react';
import { useForm } from 'react-hook-form';
import { checkUserName } from '@/entities/UserManage/api';
import { emailList } from '@/entities/UserManage/const';
import { Button, IEmail, Input, SelectBox } from '@/shared/ui';
import {
  subButton,
  inputContainer,
  inputHeight,
  labelContainer,
  starSpan
} from '../index.css';
import { SignupInput } from '../SingnupInput';
import { emailBox, inputBox, searchAddress } from './index.css';

interface IProps {
  register: ReturnType<typeof useForm>['register'];
  errors: Record<string, unknown>;
}

export function CommonSignupInput({ register, errors }: IProps) {
  const checkId = async (id: string) => {
    try {
      await checkUserName(id);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className={inputContainer}>
      <SignupInput
        label={'아이디'}
        placeholder={'사용하실 아이디를 입력해주세요'}
      />
      <SignupInput
        label={'비밀번호'}
        type="password"
        placeholder={'사용하실 비밀번호를 입력해주세요'}
      />
      <SignupInput
        label={'비밀번호 확인'}
        type="password"
        placeholder={'비밀번호를 다시 한 번 입력해주세요'}
      />
    </div>
  );
}

export const LocationInfo = ({ register, errors }: IProps) => {
  return (
    <div className={inputContainer}>
      <div className={inputBox}>
        <div className={searchAddress}>
          <SignupInput label={'주소'} placeholder={'주소를 검색해주세요'} />
          <div className={subButton}>
            <Button type="borderBrand" content="주소 검색" />
          </div>
        </div>
        <SignupInput
          isNeed={false}
          placeholder={'상세 주소를 입력해주세요'}
          label={''}
        />
      </div>
      <div className={inputBox}>
        <div className={searchAddress}>
          <SignupInput
            label={'휴대폰 번호'}
            placeholder={'번호를 입력해주세요'}
          />
          <div className={subButton}>
            <Button type="borderBrand" content="인증번호 발송" />
          </div>
        </div>
        <div>
          <div className={searchAddress}>
            <SignupInput
              isNeed={false}
              label={''}
              placeholder={'인증 번호를 입력해주세요'}
            />
            <div className={subButton}>
              <Button type="borderBrand" content="인증번호 확인" />
            </div>
          </div>
        </div>
      </div>
      <div className={emailBox}>
        <SignupInput label={'이메일'} isNeed={false} placeholder={''} />
        <span>@</span>
        <div
          style={{
            width: '200px',
            height: '57px'
          }}
        >
          <SelectBox options={emailList} />
        </div>
      </div>
    </div>
  );
};
