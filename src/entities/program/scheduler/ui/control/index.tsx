import React, { useState } from 'react';
import { IoReload } from 'react-icons/io5';
import { LuUndo2, LuRedo2 } from 'react-icons/lu';
import {
  controlContainer,
  buttonStyle,
  closeButton,
  confirmButtonWrapper,
  filterSection,
  modalContent,
  modalOverlay,
  planItem,
  planList
} from './index.css';
import { useScheduleStore } from '@/shared/stores/useScheduleStore';
import { getPlan, IPlan } from '@/entities/program/api';
import { Schedule } from '@/entities/program/type.dto';
import { Button } from '@/shared/ui';
import { autoRegisterPlan } from '../../model/autoRegisterPlan';

export function Control({ isAdmin }: { isAdmin: boolean }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const { undo, redo, reInit } = useScheduleStore();

  return (
    <div className={controlContainer}>
      <button className={buttonStyle} onClick={undo}>
        <LuUndo2 size={24} />
        실행 취소
      </button>
      <button className={buttonStyle} onClick={redo}>
        <LuRedo2 size={24} />
        실행 복구
      </button>
      <button className={buttonStyle} onClick={reInit}>
        <IoReload size={24} />
        초기화
      </button>
      <button className={buttonStyle} onClick={() => setModalOpen(true)}>
        계획안 불러오기
      </button>

      {isModalOpen && <PlanModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}

interface IProps {
  onClose: () => void;
}

const PlanModal = ({ onClose }: IProps) => {
  const [plans, setPlans] = useState<IPlan>();
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [difficultyLevel, setDifficultyLevel] = useState(1);

  const updateSchedule = useScheduleStore(state => state.updateSchedule);

  const handleConfirm = async () => {
    try {
      const res = await getPlan({ year, month, difficultyLevel });
      setPlans(res);
      console.log(res);

      await autoRegisterPlan({
        year: year,
        month: month,
        difficultyLevel: difficultyLevel
      });
    } catch (error) {
      console.error('계획안 불러오기 실패:', error);
    }
    onClose();
  };

  const currentYear = new Date().getFullYear();
  const yearRange = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <div className={modalOverlay}>
      <div className={modalContent} style={{ position: 'relative' }}>
        <button className={closeButton} onClick={onClose}>
          ✕
        </button>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: '500',
            marginBottom: '12px'
          }}
        >
          계획안 불러오기
        </h1>

        <div className={filterSection}>
          <label>
            <select value={year} onChange={e => setYear(e.target.value)}>
              {Array.from({ length: 11 }, (_, i) => {
                const y = new Date().getFullYear() - 5 + i;
                return (
                  <option key={y} value={y.toString()}>
                    {y}년
                  </option>
                );
              })}
            </select>
          </label>

          <label>
            <select value={month} onChange={e => setMonth(e.target.value)}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m.toString()}>
                  {m}월
                </option>
              ))}
            </select>
          </label>

          <label>
            <select
              value={difficultyLevel}
              onChange={e => setDifficultyLevel(Number(e.target.value))}
            >
              {[1, 2, 3].map(level => (
                <option key={level} value={level}>
                  {level === 1 ? '상' : level === 2 ? '중' : '하'}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={confirmButtonWrapper}>
          <Button onClick={handleConfirm} content="확인" type="brand" />
        </div>
      </div>
    </div>
  );
};
