import { IEmail } from '@/shared/ui/types';
import { checkUserName } from './api';

interface ISignup {
  label: string;
  placeholder: string;
  isImportant: boolean;
}

export const commonData: ISignup[] = [
  {
    label: '아이디',
    placeholder: '사용하실 아이디를 입력해주세요',
    isImportant: true
  },
  {
    label: '비밀번호',
    placeholder: '사용하실 비밀번호를 입력해주세요',
    isImportant: true
  },
  {
    label: '비밀번호 확인',
    placeholder: '비밀번호를 다시 한 번 입력해주세요',
    isImportant: true
  }
];

export const companyData: ISignup[] = [
  {
    label: '대표자명',
    placeholder: '사업주 이름을 입력해주세요',
    isImportant: true
  },
  {
    label: '기관명',
    placeholder: '사업명을 입력해주세요',
    isImportant: true
  },
  {
    label: '사업자번호',
    placeholder: '사업자번호를 입력해주세요',
    isImportant: true
  },
  {
    label: '개업일자',
    placeholder: '개업일자를 입력해주세요',
    isImportant: true
  }
];

export const individualData: ISignup[] = [
  {
    label: '이름',
    placeholder: '이름을 입력해주세요',
    isImportant: true
  },
  {
    label: '휴대폰 번호',
    placeholder: '번호를 입력해주세요',
    isImportant: true
  }
];

export const inputGroups = [
  {
    groupName: 'common',
    fields: [
      {
        name: 'username',
        label: '아이디',
        placeholder: '사용하실 아이디를 입력해주세요',
        isImportant: true,
        type: 'text'
      },
      {
        name: 'password',
        label: '비밀번호',
        placeholder: '사용하실 비밀번호를 입력해주세요',
        isImportant: true,
        type: 'password'
      },
      {
        name: 'passwordConfirm',
        label: '비밀번호 확인',
        placeholder: '비밀번호를 다시 입력해주세요',
        isImportant: true,
        type: 'password'
      }
    ]
  },
  {
    groupName: 'company',
    fields: [
      {
        name: 'representativeName',
        label: '대표자명',
        placeholder: '사업주 이름을 입력해주세요',
        isImportant: true,
        type: 'text'
      },
      {
        name: 'companyName',
        label: '기관명',
        placeholder: '사업명을 입력해주세요',
        isImportant: true,
        type: 'text'
      },
      {
        name: 'businessNumber',
        label: '사업자번호',
        placeholder: '사업자번호를 입력해주세요',
        isImportant: true,
        type: 'text'
      },
      {
        name: 'openingDate',
        label: '개업일자',
        placeholder: '개업일자를 입력해주세요',
        isImportant: true,
        type: 'date'
      }
    ]
  },
  {
    groupName: 'individual',
    fields: [
      {
        name: 'name',
        label: '이름',
        placeholder: '이름을 입력해주세요',
        isImportant: true,
        type: 'text'
      },
      {
        name: 'phone',
        label: '휴대폰 번호',
        placeholder: '휴대폰 번호를 입력해주세요',
        isImportant: true,
        type: 'tel',
        subFields: [
          {
            name: 'authCode',
            label: '인증번호',
            placeholder: '인증번호를 입력해주세요',
            isImportant: true,
            type: 'text'
          }
        ]
      }
    ]
  }
];

export const emailList: IEmail[] = [
  {
    label: 'naver.com',
    value: 'naver.com'
  },
  {
    label: 'google.com',
    value: 'gmail.com'
  },
  {
    label: 'kakao.com',
    value: 'kakao.com'
  },
  {
    label: 'daum.net',
    value: 'daum.net'
  }
];
