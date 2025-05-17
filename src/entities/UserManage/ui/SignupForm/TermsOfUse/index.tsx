'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { IoIosArrowForward, IoIosCheckmarkCircle } from 'react-icons/io';
import { colors } from '@/design-tokens';
import { IFormIndividual, IFormCompany } from '@/entities/UserManage/type';
import { inputContainer, starSpan } from '../index.css';
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

interface IProps {
  formData: IFormIndividual | IFormCompany;
  handleInputChange: (
    field: keyof (IFormIndividual | IFormCompany),
    value: any
  ) => void;
}

export function TermsOfUse({ formData, handleInputChange }: IProps) {
  const [isTermOfUse, setIsTermOfUse] = useState(false);
  const [isModal, setIsModal] = useState(false);

  const termsChecked = formData.termOfUse[0];
  const personalChecked = formData.termOfUse[1];
  const isAllTrue =
    termsChecked && personalChecked
      ? colors.brand[500]
      : colors.gray_scale[300];

  const toggleTermsValue = () => {
    const newTermOfUse = [...formData.termOfUse];
    newTermOfUse[0] = !termsChecked;
    handleInputChange('termOfUse', newTermOfUse);
  };

  const togglePersonalValue = () => {
    const newTermOfUse = [...formData.termOfUse];
    newTermOfUse[1] = !personalChecked;
    handleInputChange('termOfUse', newTermOfUse);
  };

  const toggleAllAgree = () => {
    const newValue = !(termsChecked && personalChecked);
    handleInputChange('termOfUse', [newValue, newValue]);
  };

  return (
    <div className={inputContainer}>
      <div className={selectContainer}>
        <div className={labelContainer}>
          <span>
            이용약관동의 <span className={starSpan}>*</span>
          </span>
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
                    termsChecked ? colors.brand[500] : colors.gray_scale[300]
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
                    personalChecked ? colors.brand[500] : colors.gray_scale[300]
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
