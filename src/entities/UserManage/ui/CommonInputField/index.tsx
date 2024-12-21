import { Button, Input } from '@/shared/ui';

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
  return (
    <div>
      {fields.map(field => (
        <div key={field.name}>
          {/* 메인 필드 */}
          <Input
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            type={field.type || 'text'}
          />
          {/* 하위 필드 렌더링 */}
          {field.subFields?.map(subField => (
            <div key={subField.name}>
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
    <div>
      <div>
        <div>
          <Input
            label={
              <div>
                <span>주소</span>
                <span>*</span>
              </div>
            }
            placeholder="사용하실 아이디를 입력해주세요"
          />
          <Button type="borderBrand" content={'주소 검색'} />
        </div>
        <Input placeholder="상세 주소를 입력해주세요" />
      </div>
      <div>
        <div>
          <Input
            label={
              <div>
                <span>휴대폰 번호</span>
                <span>*</span>
              </div>
            }
            placeholder="사용하실 아이디를 입력해주세요"
          />
          <Button type="borderBrand" content={'인증번호 발송'} />
        </div>

        <div>
          <Input placeholder="인증 번호를 입력해주세요" />
          <Button type="borderBrand" content={'인증번호 확인'} />
        </div>
      </div>
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
    </div>
  );
}
