'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { IoIosArrowForward, IoIosCheckmarkCircle } from 'react-icons/io';
import { colors } from '@/design-tokens';
import { IForm } from '@/entities/UserManage/type';
import { inputContainer } from '../index.css';
import { PersonalInformationProcessing } from './components/PersonalInformationProcessing';
import { TermsOfUseModal } from './components/TermsOfUseModal';
import {
  allAccepts,
  iconSize,
  labelContainer,
  lookAccept,
  select,
  selectBox,
  selectContainer
} from './index.css';

export function TermsOfUse({
  setValue,
  watch
}: {
  watch: UseFormWatch<IForm>;
  setValue: UseFormSetValue<IForm>;
}) {
  const [isTermOfUse, setIsTermOfUse] = useState(false);
  const [isModal, setIsModal] = useState(false);

  const termsChecked = watch('termOfUse.0');
  const personalChecked = watch('termOfUse.1');
  const isAllTrue =
    termsChecked && termsChecked ? colors.gray_scale[300] : colors.brand[500];

  const toggleTermsValue = () => setValue('termOfUse.0', !termsChecked);
  const togglePersonalValue = () => setValue('termOfUse.1', !personalChecked);

  const toggleAllAgree = () => {
    const newValue = !(termsChecked && personalChecked);
    setValue('termOfUse.0', newValue);
    setValue('termOfUse.1', newValue);
  };

  return (
    <div className={inputContainer}>
      <div className={selectContainer}>
        <div className={labelContainer}>
          <span>이용약관동의</span>
        </div>
        <div>
          <div
            className={`${selectBox} ${allAccepts}`}
            onClick={toggleAllAgree}
          >
            <IoIosCheckmarkCircle color={isAllTrue} size={25} />
            <span>전체 동의</span>
          </div>

          <div className={selectBox}>
            <TermsOfUseModal
              isTermOfUse={isTermOfUse}
              setIsTermOfUse={setIsTermOfUse}
              setTermsValue={toggleTermsValue}
            />
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '10px'
              }}
            >
              <div className={select}>
                <IoIosCheckmarkCircle
                  color={
                    termsChecked ? colors.gray_scale[300] : colors.brand[500]
                  }
                  size={25}
                />
                <span>이용약관 동의 (필수)</span>
              </div>
              <div className={lookAccept} onClick={() => setIsTermOfUse(true)}>
                <span>약관보기</span>
                <IoIosArrowForward />
              </div>
            </div>
          </div>

          <div className={selectBox}>
            <PersonalInformationProcessing
              isModal={isModal}
              setIsModal={setIsModal}
              setPersonalValue={togglePersonalValue}
            />
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '10px'
              }}
            >
              <div className={select}>
                <IoIosCheckmarkCircle
                  color={
                    personalChecked ? colors.gray_scale[300] : colors.brand[500]
                  }
                  size={25}
                />
                <span>개인정보 처리방침 동의 (필수)</span>
              </div>
              <div className={lookAccept} onClick={() => setIsModal(true)}>
                <span>약관보기</span>
                <IoIosArrowForward />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
