import React from 'react';
import { NomalInput } from '@/shared/ui/Input';
import { Button } from '@/shared/ui';
import { labelContainer, starSpan } from '../SignupForm/index.css';
import { buttonContainer, container } from './index.css';
import { IFormCompany } from '../../type';
import { verifyCoporate } from '../../api';
import { toast } from 'react-toastify';
import { colors } from '@/design-tokens';

interface IProps {
  formData: IFormCompany;
  handleInputChange: (
    field: keyof IFormCompany,
    value: string | { year: string; month: string; day: string }
  ) => void;
}

export const CompanyInfo = ({ formData, handleInputChange }: IProps) => {
  const handleVerifyCorporate = async () => {
    try {
      await verifyCoporate({
        b_no: formData.corporateNumber,
        start_dt: formData.openingDate,
        p_nm: formData.representativeName,
        b_nm: formData.companyName
      });

      toast.success('기관인증이 완료되었습니다.');
    } catch (error: any) {
      toast.error(
        '기관인증 중 오류가 발생했습니다.'
      );
    }
  };

  return (
    <div className={container}>
      <NomalInput
        placeholder="대표자명을 입력해주세요"
        inputSize="medium"
        label={
          <div className={labelContainer}>
            대표자명 <span className={starSpan}>*</span>
          </div>
        }
        value={formData.representativeName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleInputChange('representativeName', e.target.value)
        }
      />
      <NomalInput
        placeholder="기관명을 입력해주세요"
        inputSize="medium"
        label={
          <div className={labelContainer}>
            기관명 <span className={starSpan}>*</span>
          </div>
        }
        value={formData.companyName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleInputChange('companyName', e.target.value)
        }
      />
      <NomalInput
        placeholder="사업자 번호를 입력해주세요"
        inputSize="medium"
        label={
          <div className={labelContainer}>
            사업자 번호 <span className={starSpan}>*</span>
          </div>
        }
        value={formData.corporateNumber}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleInputChange('corporateNumber', e.target.value)
        }
      />
      <NomalInput
        placeholder="개업일자를 입력해주세요"
        inputSize="medium"
        label={
          <div className={labelContainer}>
            개업일자 <span className={starSpan}>*</span>
          </div>
        }
        value={formData.openingDate}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleInputChange('openingDate', e.target.value)
        }
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          cursor: 'pointer'
        }}
      >
        <a
          href="/images/opening_date.pdf"
          download
          style={{ color: colors.brand[400], textDecoration: 'none' }}
        >
          개업일자를 모르시나요? <span>{'>'}</span>
        </a>
        <p style={{ color: colors.brand[400] }}>(고유번호증을 보고 있어요)</p>
      </div>
      <div className={buttonContainer}>
        <Button
          btnType="button"
          type="borderBrand"
          content="기관인증"
          onClick={e => {
            e.preventDefault();
            handleVerifyCorporate();
          }}
        />
      </div>
    </div>
  );
};
