import React, { useState, useEffect } from 'react';
import { NomalInput } from '@/shared/ui/Input';
import { Button } from '@/shared/ui';
import { SelectBox } from '@/shared/ui/SelectBox';
import { labelContainer, starSpan } from '../SignupForm/index.css';
import { buttonContainer, container } from './index.css';
import { IFormCompany } from '../../type';
import { editCompanyInfo, verifyCoporate } from '../../api';
import { toast } from 'react-toastify';
import { colors } from '@/design-tokens';

interface IProps {
  formData: IFormCompany;
  handleInputChange: (field: keyof IFormCompany, value: string) => void;
  /**
   * 수정(회원정보 변경) 화면인지 여부. 기본값은 false 이며, true 인 경우 기관정보 수정 API(editCompanyInfo)를 호출합니다.
   */
  isEdit?: boolean;
}

export const CompanyInfo = ({ formData, handleInputChange, isEdit = false }: IProps) => {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  // 년도 옵션 생성 (현재 년도부터 50년 전까지)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 51 }, (_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i)
  }));

  // 월 옵션 생성
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1).padStart(2, '0')
  }));

  // 일 옵션 생성 (기본 31일)
  const dayOptions = Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1).padStart(2, '0')
  }));

  // 선택된 년월일에 따라 일 옵션 업데이트
  const getDayOptions = () => {
    if (!selectedYear || !selectedMonth) return dayOptions;

    const year = parseInt(selectedYear);
    const month = parseInt(selectedMonth);
    const daysInMonth = new Date(year, month, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => ({
      value: String(i + 1).padStart(2, '0'),
      label: String(i + 1).padStart(2, '0')
    }));
  };

  // 개업일자 업데이트
  useEffect(() => {
    if (selectedYear && selectedMonth && selectedDay) {
      const openingDate = `${selectedYear}${selectedMonth}${selectedDay}`;
      handleInputChange('openingDate', openingDate);
    }
  }, [selectedYear, selectedMonth, selectedDay, handleInputChange]);

  // 기존 개업일자 값이 있으면 파싱하여 드롭다운 값 설정
  useEffect(() => {
    if (formData.openingDate && formData.openingDate.length === 8) {
      setSelectedYear(formData.openingDate.substring(0, 4));
      setSelectedMonth(formData.openingDate.substring(4, 6));
      setSelectedDay(formData.openingDate.substring(6, 8));
    }
  }, [formData.openingDate]);

  const handleVerifyCorporate = async () => {
    // 필수 필드 검증
    const missingFields = [];

    if (!formData.representativeName) {
      missingFields.push('대표자명');
    }
    if (!formData.companyName) {
      missingFields.push('기관명');
    }
    if (!formData.corporateNumber) {
      missingFields.push('사업자 번호');
    }
    if (!formData.openingDate) {
      missingFields.push('개업일자');
    }

    if (missingFields.length > 0) {
      toast.error(`${missingFields.join(', ')}을(를) 입력해주세요.`);
      return;
    }

    try {
      if (isEdit) {
        // 수정화면: 기관 정보 수정 API 호출
        await editCompanyInfo({
          b_no: formData.corporateNumber,
          start_dt: formData.openingDate,
          p_nm: formData.representativeName,
          b_nm: formData.companyName
        });
      } else {
        // 회원가입화면: 기관 인증 API 호출
        await verifyCoporate({
          b_no: formData.corporateNumber,
          start_dt: formData.openingDate,
          p_nm: formData.representativeName,
          b_nm: formData.companyName
        });
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || '기관인증 중 오류가 발생했습니다.'
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

      {/* 개업일자 드롭다운 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '40px',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        <div
          className={labelContainer}
          style={{ flexShrink: 0, width: '176px' }}
        >
          개업일자 <span className={starSpan}>*</span>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            height: '56px',
            flex: '1 1 0%'
          }}
        >
          <div style={{ flex: 1 }}>
            <SelectBox
              options={yearOptions}
              placeholder="년도"
              value={selectedYear}
              onChange={setSelectedYear}
              isSearchable={false}
            />
          </div>
          <div style={{ flex: 1 }}>
            <SelectBox
              options={monthOptions}
              placeholder="월"
              value={selectedMonth}
              onChange={setSelectedMonth}
              isSearchable={false}
            />
          </div>
          <div style={{ flex: 1 }}>
            <SelectBox
              options={getDayOptions()}
              placeholder="일"
              value={selectedDay}
              onChange={setSelectedDay}
              isSearchable={false}
            />
          </div>
        </div>
      </div>

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
          기업정보를 모르시나요? <span>{'>'}</span>
        </a>
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
