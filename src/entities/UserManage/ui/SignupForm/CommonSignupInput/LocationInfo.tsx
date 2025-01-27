'use client';

import { useDaumPostcodePopup } from 'react-daum-postcode';
import {
  verifyPhoneNum,
  checkAuthenticationNumber
} from '@/entities/UserManage/api';
import { emailList } from '@/entities/UserManage/const';
import { SelectBox } from '@/shared';
import { Button } from '@/shared/ui';
import { inputContainer, subButton } from '../index.css';
import { SignupInput } from '../SingnupInput';
import {
  generateYears,
  generateMonths,
  generateDays,
  handleComplete
} from '../utils';
import { IProps } from './CommonSignupInput';
import {
  inputBox,
  birthContainer,
  birthLabelBox,
  birthBox,
  birthDropdown,
  searchAddress,
  emailBox
} from './index.css';

const scriptUrl =
  'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

export const LocationInfo = ({
  type = 'company',
  register,
  errors,
  watch
}: IProps) => {
  const open = useDaumPostcodePopup(scriptUrl);
  const yearList = generateYears();
  const monthList = generateMonths();
  const dayList = generateDays(2025, 1);

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  const checkPhoneVerification = async () => {
    try {
      const res = await verifyPhoneNum('01062582610');
      console.log(res);
    } catch {
      console.error('Failed to verify phone number');
    }
  };

  const checkPhoneAuthentication = async () => {
    try {
      const res = await checkAuthenticationNumber({
        code: '123123',
        phoneNum: '01062582610'
      });
      console.log(res);
    } catch {
      console.error('Failed to verify phone number');
    }
  };

  return (
    <div className={inputContainer}>
      <div className={inputBox}>
        <SignupInput
          register={register('name', {
            required: { value: true, message: '반드시 입력해주세요.' }
          })}
          label={'이름'}
          placeholder={'이름를 입력해주세요'}
        />
        <div className={birthContainer}>
          <label className={birthLabelBox}>생년월일</label>
          <div className={birthBox}>
            <div className={birthDropdown}>
              <SelectBox options={yearList} placeholder={'년'} />
            </div>
            <div className={birthDropdown}>
              <SelectBox options={monthList} placeholder={'월'} />
            </div>
            <div className={birthDropdown}>
              <SelectBox options={dayList} placeholder={'일'} />
            </div>
          </div>
        </div>

        <div className={searchAddress}>
          <SignupInput label={'주소'} placeholder={'주소를 검색해주세요'} />
          <div className={subButton}>
            <Button
              onClick={handleClick}
              type="borderBrand"
              content="주소 검색"
            />
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
            register={register('phone', {
              required: { value: true, message: '반드시 입력해주세요.' }
            })}
          />
          <div className={subButton}>
            <Button
              onClick={checkPhoneVerification}
              type="borderBrand"
              content="인증번호 발송"
            />
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
              <Button
                onClick={checkPhoneAuthentication}
                type="borderBrand"
                content="인증번호 확인"
              />
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
          <SelectBox options={emailList} placeholder={'선택하기'} />
        </div>
      </div>
    </div>
  );
};
