import React from 'react';
import { colors } from '@/design-tokens';
import { Button, Modal } from '@/shared/ui';
import {
  cellStyle,
  modalContainer,
  personalModalBody,
  title
} from './index.css';

interface IProps {
  isModal: boolean;
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
  setPersonalValue?: () => void;
}

export function PersonalInformationProcessing({
  isModal,
  setIsModal,
  setPersonalValue
}: IProps) {
  return (
    <Modal
      isOpen={isModal}
      setIsOpen={() => setIsModal(prev => !prev)}
      modalSize={{
        width: '860px',
        height: '501px'
      }}
    >
      <div className={modalContainer}>
        <div className={title}>
          <span>개인정보 처리방침</span>
        </div>
        <div className={personalModalBody}>
          <table
            style={{
              borderCollapse: 'collapse',
              width: '100%',
              tableLayout: 'fixed'
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid black',
                  backgroundColor: colors.gray_scale[200]
                }}
              >
                <th className={cellStyle}>수집 목적</th>
                <th className={cellStyle}>항목</th>
                <th className={cellStyle}>보유기간</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid gray' }}>
                <td className={cellStyle}>이용자 식별 및 본인 확인</td>
                <td className={cellStyle}>아이디, 이름, 비밀번호</td>
                <td className={cellStyle}>회원 탈퇴 시까지</td>
              </tr>
              <tr style={{ borderBottom: '1px solid gray' }}>
                <td className={cellStyle}>
                  고객서비스 이용에 관한 통지,CS대응을 위한 이용자 식별
                </td>
                <td className={cellStyle}>연락처 (이메일, 휴대전화번호)</td>
                <td className={cellStyle}>회원 탈퇴 시까지</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          style={{
            width: '200px',
            height: '56px',
            margin: 'auto'
          }}
        >
          <Button
            onClick={() => {
              setPersonalValue && setPersonalValue();
              setIsModal(false);
            }}
            type={'brand'}
            btnSize={'large'}
            content={'확인'}
          />
        </div>
      </div>
    </Modal>
  );
}
