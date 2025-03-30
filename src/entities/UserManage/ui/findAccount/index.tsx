import React from 'react';
import { Button, Input } from '@/shared/ui';
import { container, inputContainer, title } from './index.css';

interface RecoverFormProps {
  type: 'id' | 'password';
}
export function FindAccounts({ type }: RecoverFormProps) {
  return (
    <div className={container}>
      <div className={title}>
        <h1>{type === 'id' ? '아이디 찾기' : '비밀번호 찾기'}</h1>
      </div>
      <div className={inputContainer}>
        {type === 'id' ? (
          <Input
            label={<div>이름</div>}
            // register={register('id')}
            labelInputGap={12}
            labelPosition="vertical"
            inputSize="medium"
            placeholder="이름을 입력해주세요"
          />
        ) : (
          <Input
            label={<div>아이디</div>}
            // register={register('id')}
            labelInputGap={12}
            labelPosition="vertical"
            inputSize="medium"
            placeholder="아이디를 입력해주세요"
          />
        )}
        <div>
          <Input
            label={<div>휴대폰 번호</div>}
            // register={register('id')}
            labelInputGap={12}
            labelPosition="vertical"
            inputSize="medium"
            placeholder="휴대폰 번호를 입력해주세요"
          />
          <div>
            <Input
              // register={register('id')}
              labelInputGap={12}
              labelPosition="vertical"
              inputSize="medium"
              placeholder="휴대폰 번호를 입력해주세요"
            />
          </div>
        </div>
        <div>
          <div>
            <Button type="beforeSelection" content="회원가입" />
          </div>
          <div>
            <Button type="default" content="회원가입" />
          </div>
        </div>
      </div>
    </div>
  );
}
