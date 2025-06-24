'use client';

import { useState, useEffect } from 'react';
import { Box, Modal } from '@mui/material';
import { Button } from '@/shared/ui';
import { NomalInput } from '@/shared/ui/Input';
import * as styles from './index.css';
import { IRegUser } from '../type.dto';
import { DropDown } from '../menu/dropDown';
import { submitAddUser, updateUser } from '../api';
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

export function AddUser({
  open,
  closeModal,
  onSuccess,
  defaultValue,
  mode
}: {
  open: boolean;
  closeModal: () => void;
  onSuccess?: () => void;
  defaultValue?: IRegUser;
  mode?: 'add' | 'edit';
}) {
  const [form, setForm] = useState<IRegUser>({
    name: '',
    servicer: '',
    difficulty: '',
    grade: ''
  });

  useEffect(() => {
    if (defaultValue && mode === 'edit') {
      setForm(defaultValue);
    } else {
      setForm({
        name: '',
        servicer: '',
        difficulty: '',
        grade: ''
      });
    }
  }, [defaultValue, mode, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.servicer.trim() ||
      !form.difficulty.trim() ||
      !form.grade.trim()
    ) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    // 고정된 날짜와 장기요양 인정번호로 서버에 전송
    const fixedData = {
      ...form,
      longTermNum: 'L0000000000-000',
      birthDate: '2000-01-01',
      certificationStart: '1900-01-01',
      certificationEnd: '2100-12-31'
    };

    try {
      if (mode === 'edit' && defaultValue) {
        await updateUser(Number(defaultValue.elderId), fixedData);
        toast.success('수정이 완료되었습니다!');
      } else {
        await submitAddUser(fixedData);
        toast.success('등록이 완료되었습니다!');
      }
      closeModal();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('저장 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  return (
    <Modal open={open} onClose={closeModal}>
      <Box className={styles.modalStyle}>
        <div
          style={{ marginBottom: '32px', fontSize: '20px', fontWeight: 600 }}
        >
          {mode === 'edit' ? '대상자 수정' : '대상자 등록'}
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
            <Button
              content={mode === 'edit' ? '수정' : '확인'}
              btnType="submit"
              type="brand"
            />
          </div>
        </form>
      </Box>
    </Modal>
  );
}
