import { colors } from '@/design-tokens';
import { inputGroups } from '../const';
import { CommonInputField, DynamicInputGroup } from '../ui/CommonInputField';
import { info, inputContainer, subTitle, title } from './index.css';

export function Company() {
  return (
    <div className={inputContainer}>
      <div
        style={{
          marginBottom: '40px'
        }}
      >
        <p className={title}>회원가입</p>
        <p className={subTitle}>
          <span className={subTitle}>
            로그인에 사용할 회원 정보를 입력해주세요
          </span>
          <span className={info}>
            (
            <span
              style={{
                color: colors.brand[400]
              }}
            >
              *
            </span>
            : 필수입력 )
          </span>
        </p>
      </div>
      <div>
        {inputGroups.map((group, index) => (
          <DynamicInputGroup key={index} fields={group.fields} />
        ))}
      </div>
      <CommonInputField />
    </div>
  );
}
