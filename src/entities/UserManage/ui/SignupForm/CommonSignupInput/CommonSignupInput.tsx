'use client';

import { useEffect, useState } from 'react';
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form';
import { BsCheck2, BsX } from 'react-icons/bs';
import { checkUserName } from '@/entities/UserManage/api';
import { IForm } from '@/entities/UserManage/type';
import { inputContainer } from '../index.css';
import { SignupInput } from '../SingnupInput';
import { searchAddress, validateId } from './index.css';

export interface IProps {
  register: UseFormRegister<IForm>;
  errors: FieldErrors<IForm>;
  type?: string;
  watch: UseFormWatch<IForm>;
  setValue?: UseFormSetValue<IForm>;
}

export function CommonSignupInput({ register, errors, watch }: IProps) {
  const [validateUserName, setValidateUserName] = useState<boolean>(false);

  const checkUserNameHandler = async (value: string) => {
    try {
      const res = await checkUserName(value);
      const validation =
        res.message === '사용 가능한 아이디입니다.' ? true : false;
      setValidateUserName(validation);
      return validation;
    } catch (err) {
      console.log(err);
    }
  };
  const password = watch('password');
  const id = watch('id');
  const commonStyle = {
    display: 'flex',
    alignItems: 'center'
  };

  useEffect(() => {
    if (!id) return; // 값이 비어있으면 실행하지 않음

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await checkUserName(id);
        const isAvailable = res.message === '사용 가능한 아이디입니다.';
        setValidateUserName(isAvailable);
      } catch (err) {
        console.error(err);
      }
    }, 500); // 500ms 딜레이 (디바운스)

    return () => clearTimeout(delayDebounceFn); // Cleanup function
  }, [id]); // ✅ id가 변경될 때만 실행됨

  return (
    <div className={inputContainer}>
      <div className={searchAddress}>
        <SignupInput
          register={register('id', {
            required: { value: true, message: '반드시 입력해주세요.' },
            validate: async (value: string) => {
              const isAvailable = await checkUserNameHandler(value); // 비동기 검증
              return isAvailable || '이미 사용 중인 아이디입니다.'; // 검증 실패 시 메시지 반환
            }
          })}
          label={'아이디'}
          placeholder={'사용하실 아이디를 입력해주세요'}
          error={errors.id && errors.id?.message}
        />
        {id.length > 0 && (
          <div className={validateId({ isActive: validateUserName })}>
            <div>
              <div style={commonStyle}>
                {validateUserName ? (
                  <>
                    <BsCheck2 size="24px" />
                    <span>사용 가능</span>
                  </>
                ) : (
                  <>
                    <BsX size="24px" />
                    <span>사용 불가능</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        <SignupInput
          label={'비밀번호'}
          type="password"
          placeholder={'사용하실 비밀번호를 입력해주세요'}
          error={errors.password && errors.password?.message}
          register={register('password', {
            required: { value: true, message: '반드시 입력해주세요.' },
            minLength: 8,
            maxLength: 20,
            pattern:
              /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/
          })}
        />
      </div>

      <div>
        <SignupInput
          label={'비밀번호 확인'}
          type="password"
          placeholder={'비밀번호를 다시 한 번 입력해주세요'}
          error={errors.passwordConfirm && errors.passwordConfirm?.message}
          register={register('passwordConfirm', {
            required: { value: true, message: '비밀번호를 입력해주세요.' },
            validate: value => {
              return value === password || '비밀번호가 일치하지 않습니다.';
            }
          })}
        />
      </div>
      <p></p>
    </div>
  );
}
