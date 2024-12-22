'use client';

import { Button, Input } from '@/shared/ui';
import { inputBox, inputContainer, signupBtn } from './index.css';
import { checkUserName } from '../../api';

type SubField = {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
};

type Field = {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  subFields?: SubField[]; // 하위 필드
};

type InputGroupProps = {
  fields: Field[];
};

export const DynamicInputGroup: React.FC<InputGroupProps> = ({ fields }) => {
  const useNameChecker = async (event: React.ChangeEvent<HTMLInputElement>) => {
    await checkUserName(event.target.value);
    console.log('Current Value:', event.target.value);
  };

  return (
    <div className={inputContainer}>
      {fields.map(field => (
        <div className={inputBox} key={field.name}>
          <Input
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            type={field.type || 'text'}
            onChange={field.name === 'username' ? useNameChecker : undefined}
          />
          {field.subFields?.map(subField => (
            <div className={inputBox} key={subField.name}>
              <Input
                name={subField.name}
                label={subField.label}
                placeholder={subField.placeholder}
                type={subField.type || 'text'}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export function DefaultInfo() {
  return <></>;
}

export function CommonInputField() {
  return (
    <div className={inputContainer}>
      <div>
        <div className={inputBox}>
          <Input
            label={
              <div>
                <span>주소</span>
                <span>*</span>
              </div>
            }
            placeholder="사용하실 아이디를 입력해주세요"
          />
          <div className={signupBtn}>
            <Button type="borderBrand" content={'주소 검색'} />
          </div>
        </div>
        <Input placeholder="상세 주소를 입력해주세요" />
      </div>
      <div>
        <div className={inputBox}>
          <Input
            label={
              <div>
                <span>휴대폰 번호</span>
                <span>*</span>
              </div>
            }
            placeholder="사용하실 아이디를 입력해주세요"
          />
          <div className={signupBtn}>
            <Button type="borderBrand" content={'인증번호 발송'} />
          </div>
        </div>

        <div className={inputBox}>
          <Input placeholder="인증 번호를 입력해주세요" />
          <div className={signupBtn}>
            <Button
              btnSize="small"
              type="borderBrand"
              content={'인증번호 확인'}
            />
          </div>
        </div>
      </div>

      <div className={inputBox}>
        <Input
          label={
            <div>
              <span>이메일</span>
              <span>*</span>
            </div>
          }
          placeholder="이메일을 입력해주세요"
        />
        <span>@</span>
        <Input placeholder="이메일을 입력해주세요" />
      </div>
    </div>
  );
}
