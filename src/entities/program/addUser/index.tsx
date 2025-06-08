'use client';

import { useState, useEffect } from 'react';
import { Box, Modal } from '@mui/material';
import { Button } from '@/shared/ui';
import { NomalInput } from '@/shared/ui/Input';
import * as styles from './index.css';
import { IRegUser } from '../type.dto';
import { DropDown } from '../menu/dropDown';
import { submitAddUser } from '../api';
import { toast } from 'react-toastify';

const difficulty = [
  { label: '상', value: '1' },
  { label: '중', value: '2' },
  { label: '하', value: '3' }
];

const grade = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' }
];

const currentYear = new Date().getFullYear();

const birthYears = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => {
  const year = 1900 + i;
  return { label: `${year}`, value: `${year}` };
});
const years = Array.from({ length: 6 }, (_, i) => {
  const year = 2025 + i;
  return { label: `${year}`, value: `${year}` };
});
const months = Array.from({ length: 12 }, (_, i) => {
  const month = i + 1;
  return { label: `${month}`, value: `${month}` };
});
const days = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  return { label: `${day}`, value: `${day}` };
});

export function AddUser({
  open,
  closeModal,
  defaultValue,
  mode
}: {
  open: boolean;
  closeModal: () => void;
  defaultValue?: IRegUser;
  mode?: 'add' | 'edit';
}) {
  const [form, setForm] = useState<IRegUser>({
    name: '',
    birthDate: '',
    longTermNum: '',
    certificationStart: '',
    certificationEnd: '',
    servicer: '',
    difficulty: '',
    grade: ''
  });

  const [birth, setBirth] = useState({ year: '', month: '', day: '' });
  const [validateStartDate, setValidateStartDate] = useState({
    year: '',
    month: '',
    day: ''
  });
  const [validateEndDate, setValidateEndDate] = useState({
    year: '',
    month: '',
    day: ''
  });

  useEffect(() => {
    if (defaultValue && mode === 'edit') {
      setForm(defaultValue);

      if (defaultValue.birthDate) {
        const [year, month, day] = defaultValue.birthDate.split('-');
        setBirth({ year, month, day });
      }
      if (defaultValue.certificationStart) {
        const [year, month, day] = defaultValue.certificationStart.split('-');
        setValidateStartDate({ year, month, day });
      }
      if (defaultValue.certificationEnd) {
        const [year, month, day] = defaultValue.certificationEnd.split('-');
        setValidateEndDate({ year, month, day });
      }
    }
    // eslint-disable-next-line
  }, [defaultValue, mode]);

  const handleBirthChange = (type: 'year' | 'month' | 'day', value: string) => {
    const updated = { ...birth, [type]: value };
    setBirth(updated);

    const { year, month, day } = updated;
    if (year && month && day) {
      setForm(prev => ({
        ...prev,
        birthDate: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      }));
    }
  };

  const handleValidateStartChange = (
    type: 'year' | 'month' | 'day',
    value: string
  ) => {
    const updated = { ...validateStartDate, [type]: value };
    setValidateStartDate(updated);

    const { year, month, day } = updated;
    if (year && month && day) {
      setForm(prev => ({
        ...prev,
        validate: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      }));
    }
  };

  const handleValidateEndChange = (
    type: 'year' | 'month' | 'day',
    value: string
  ) => {
    const updated = { ...validateEndDate, [type]: value };
    setValidateEndDate(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.longTermNum.trim() ||
      !form.birthDate.trim() ||
      !form.servicer.trim() ||
      !form.difficulty.trim() ||
      !form.grade.trim() ||
      !validateEndDate.year ||
      !validateEndDate.month ||
      !validateEndDate.day
    ) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    const certificationStart = `${validateStartDate.year}-${validateStartDate.month.padStart(2, '0')}-${validateStartDate.day.padStart(2, '0')}`;
    const certificationEnd = `${validateEndDate.year}-${validateEndDate.month.padStart(2, '0')}-${validateEndDate.day.padStart(2, '0')}`;

    try {
      const result = await submitAddUser({
        ...form,
        certificationStart,
        certificationEnd
      });
      toast.success('등록이 완료되었습니다!');
      closeModal();
    } catch (error) {
      toast.error('등록 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  return (
    <Modal open={open} onClose={closeModal}>
      <Box className={styles.modalStyle}>
        <div
          style={{ marginBottom: '32px', fontSize: '20px', fontWeight: 600 }}
        >
          대상자 등록
        </div>
        <form onSubmit={handleSubmit}>
          {/* 이름 */}
          <div className={styles.rowStyle}>
            <label className={styles.labelStyle}>
              이름<span className={styles.starSpan}>*</span>
            </label>
            <div className={styles.inputWrapperStyle}>
              <NomalInput
                name="name"
                placeholder="대상자의 이름을 입력해주세요"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
          </div>

          {/* 장기요양인증번호 */}
          <div className={styles.rowStyle}>
            <label className={styles.labelStyle}>
              장기요양인정번호<span className={styles.starSpan}>*</span>
            </label>
            <div className={styles.inputWrapperStyle}>
              <NomalInput
                name="longTermNum"
                placeholder="장기요양인정번호"
                value={form.longTermNum}
                onChange={e =>
                  setForm({ ...form, longTermNum: e.target.value })
                }
              />
            </div>
          </div>

          {/* 생년월일 */}
          <div className={styles.rowStyle}>
            <label className={styles.labelStyle}>
              생년월일<span className={styles.starSpan}>*</span>
            </label>
            <div className={styles.inputWrapperStyle}>
              <div className={styles.dateGroup}>
                <div className={styles.dateItem}>
                  <div className={styles.select128}>
                    <DropDown
                      options={birthYears}
                      placeholder="년"
                      isSearchable={false}
                      value={birth.year}
                      onChange={(val: string) => handleBirthChange('year', val)}
                    />
                  </div>
                  <span>년</span>
                  <div className={styles.select128}>
                    <DropDown
                      options={months}
                      placeholder="월"
                      isSearchable={false}
                      value={birth.month}
                      onChange={(val: string) =>
                        handleBirthChange('month', val)
                      }
                    />
                  </div>
                  <span>월</span>
                  <div className={styles.select128}>
                    <DropDown
                      options={days}
                      placeholder="일"
                      isSearchable={false}
                      value={birth.day}
                      onChange={(val: string) => handleBirthChange('day', val)}
                    />
                  </div>
                  <span>일</span>
                </div>
              </div>
            </div>
          </div>

          {/* 인정유효기간 */}
          <div className={styles.rowStyle}>
            <label className={styles.labelStyle}>
              인정유효기간<span className={styles.starSpan}>*</span>
            </label>
            <div className={styles.inputWrapperStyle}>
              <div className={styles.dateGroup}>
                <div className={styles.dateSection}>
                  <div className={styles.dateLabel}>시작일</div>
                  <div className={styles.dateItem}>
                    <div className={styles.select128}>
                      <DropDown
                        options={years}
                        placeholder="년"
                        isSearchable={false}
                        value={validateStartDate.year}
                        onChange={(val: string) =>
                          handleValidateStartChange('year', val)
                        }
                      />
                    </div>
                    <span>년</span>
                    <div className={styles.select128}>
                      <DropDown
                        options={months}
                        placeholder="월"
                        isSearchable={false}
                        value={validateStartDate.month}
                        onChange={(val: string) =>
                          handleValidateStartChange('month', val)
                        }
                      />
                    </div>
                    <span>월</span>
                    <div className={styles.select128}>
                      <DropDown
                        options={days}
                        placeholder="일"
                        isSearchable={false}
                        value={validateStartDate.day}
                        onChange={(val: string) =>
                          handleValidateStartChange('day', val)
                        }
                      />
                    </div>
                    <span>일</span>
                  </div>
                </div>
                <div className={styles.dateSection}>
                  <div className={styles.dateLabel}>종료일</div>
                  <div className={styles.dateItem}>
                    <div className={styles.select128}>
                      <DropDown
                        options={years}
                        placeholder="년"
                        isSearchable={false}
                        value={validateEndDate.year}
                        onChange={(val: string) =>
                          handleValidateEndChange('year', val)
                        }
                      />
                    </div>
                    <span>년</span>
                    <div className={styles.select128}>
                      <DropDown
                        options={months}
                        placeholder="월"
                        isSearchable={false}
                        value={validateEndDate.month}
                        onChange={(val: string) =>
                          handleValidateEndChange('month', val)
                        }
                      />
                    </div>
                    <span>월</span>
                    <div className={styles.select128}>
                      <DropDown
                        options={days}
                        placeholder="일"
                        isSearchable={false}
                        value={validateEndDate.day}
                        onChange={(val: string) =>
                          handleValidateEndChange('day', val)
                        }
                      />
                    </div>
                    <span>일</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 요양등급 */}
          <div className={styles.rowStyle}>
            <label className={styles.labelStyle}>
              요양등급<span className={styles.starSpan}>*</span>
            </label>
            <div className={styles.select200}>
              <DropDown
                options={grade}
                placeholder="선택"
                isSearchable={false}
                value={form.grade}
                onChange={(val: any) => setForm({ ...form, grade: val })}
              />
            </div>
          </div>

          {/* 난이도 */}
          <div className={styles.rowStyle}>
            <label className={styles.labelStyle}>
              난이도<span className={styles.starSpan}>*</span>
            </label>
            <div className={styles.select200}>
              <DropDown
                options={difficulty}
                placeholder="선택"
                isSearchable={false}
                value={form.difficulty}
                onChange={(val: any) => setForm({ ...form, difficulty: val })}
              />
            </div>
          </div>

          {/* 담당자 */}
          <div className={styles.rowStyle}>
            <label className={styles.labelStyle}>
              담당자<span className={styles.starSpan}>*</span>
            </label>
            <div className={styles.inputWrapperStyle}>
              <NomalInput
                name="servicer"
                placeholder="담당자 이름을 입력해주세요"
                value={form.servicer}
                onChange={e => setForm({ ...form, servicer: e.target.value })}
              />
            </div>
          </div>

          {/* 확인 버튼 */}
          <div
            style={{
              width: '200px',
              height: '56px',
              margin: 'auto'
            }}
          >
            <Button content="확인" btnType="submit" type="brand" />
          </div>
        </form>
      </Box>
    </Modal>
  );
}
