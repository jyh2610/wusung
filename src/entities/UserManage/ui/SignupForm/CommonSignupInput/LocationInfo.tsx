'use client';

import { useState } from 'react';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
  UseFormSetValue
} from 'react-hook-form';
import {
  verifyPhoneNum,
  checkAuthenticationNumber
} from '@/entities/UserManage/api';
import { emailList } from '@/entities/UserManage/const';
import { IForm } from '@/entities/UserManage/type';
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
import {
  inputBox,
  birthContainer,
  birthLabelBox,
  birthBox,
  birthDropdown,
  searchAddress,
  emailBox
} from './index.css';
import PhoneAuthModal from './PhoneAuthModal';

const scriptUrl =
  'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

export interface IProps {
  register: UseFormRegister<IForm>;
  errors: FieldErrors<IForm>;
  type?: string;
  watch: UseFormWatch<IForm>;
  setValue: UseFormSetValue<IForm>;
}

export const LocationInfo = ({
  type = 'company',
  register,
  errors,
  setValue,
  watch
}: IProps) => {
  const open = useDaumPostcodePopup(scriptUrl);
  const yearList = generateYears();
  const monthList = generateMonths();
  const dayList = generateDays(2025, 1);

  const [isVerified, setIsVerified] = useState(false);
  const [isModal, setIsModal] = useState(false);

  const handleClick = () => {
    open({
      onComplete: data => {
        const res = handleComplete(data);
        setValue('address', res);
      }
    });
  };

  const checkPhoneVerification = async () => {
    try {
      setIsVerified(true);
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
        {type === 'indivisual' && (
          <>
            <SignupInput
              register={register('name', {
                required: { value: true, message: '반드시 입력해주세요.' }
              })}
              label={'이름'}
              placeholder={'이름를 입력해주세요'}
              error={errors.name && errors.name?.message}
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
          </>
        )}
        <div className={searchAddress}>
          <SignupInput
            {...register('address', {
              required:
                type === 'indivisual'
                  ? false
                  : { value: true, message: '반드시 입력해주세요.' }
            })}
            error={errors.address?.message}
            label={'주소'}
            isNeed={type !== 'indivisual'}
            placeholder={'주소를 검색해주세요'}
          />
          <div className={subButton}>
            <Button
              onClick={e => {
                e.preventDefault();
                handleClick();
              }}
              type="borderBrand"
              content="주소 검색"
            />
          </div>
        </div>
        <SignupInput
          isNeed={false}
          register={register('detailAddress', {
            required:
              type === 'indivisual'
                ? false
                : { value: true, message: '반드시 입력해주세요.' }
          })}
          error={errors.detailAddress && errors.detailAddress?.message}
          placeholder={'상세 주소를 입력해주세요'}
          label={''}
        />
      </div>
      <div className={inputBox}>
        <PhoneAuthModal isModal={isModal} setIsModal={setIsModal} />
        <div className={searchAddress}>
          <SignupInput
            label={'휴대폰 번호'}
            placeholder={'번호를 입력해주세요'}
            register={register('phone', {
              required: { value: true, message: '반드시 입력해주세요.' }
            })}
            error={errors.phone && errors.phone?.message}
          />
          <div className={subButton}>
            <Button
              onClick={e => {
                e.preventDefault();
                setIsModal(true);
                checkPhoneVerification();
              }}
              type="borderBrand"
              content="인증번호 발송"
            />
          </div>
        </div>
        {isVerified && (
          <div>
            <div className={searchAddress}>
              <SignupInput
                isNeed={false}
                label={''}
                placeholder={'인증 번호를 입력해주세요'}
              />
              <div className={subButton}>
                <Button
                  onClick={e => {
                    e.preventDefault();
                    checkPhoneAuthentication();
                  }}
                  type="borderBrand"
                  content="인증번호 확인"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={emailBox}>
        <SignupInput
          register={register('email')}
          label={'이메일'}
          isNeed={false}
          placeholder={''}
        />
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
