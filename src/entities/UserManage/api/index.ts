import request from '@/shared/api/axiosInstance';
import {
  IFormCompany,
  IFormIndividual,
  ILoginData,
  IPostCheckIdRes,
  userSub
} from '../type';
import { ApiResponse } from '@/shared/type';
import { toast } from 'react-toastify';

export const checkUserName = async (userName: string) => {
  const res = await request<IPostCheckIdRes>({
    method: 'POST',
    url: '/api/common/signup/username-check',
    params: {
      username: userName
    }
  });
  return res.data;
};

export const sendSmsCode = async (num: string) => {
  const res = await request<IPostCheckIdRes>({
    method: 'POST',
    url: '/api/phone/verification/send/sms',
    data: { phoneNum: num }
  });
  return res.data;
};

export const sendSignupSmsCode = async (num: string) => {
  const res = await request<IPostCheckIdRes>({
    method: 'POST',
    url: '/api/common/signup/phone/verification/send/sms',
    data: { phoneNum: num }
  });
  return res.data.message;
};
export const verifyPhoneNum = async (num: string) => {
  const res = await request<IPostCheckIdRes>({
    method: 'POST',
    url: '/api/common/signup/phone/verification/send',
    data: {
      phoneNum: num
    }
  });
  return res.data;
};

interface IAuthenticationNumber {
  code: string;
  phoneNum: string;
}

export const checkAuthenticationNumber = async ({
  code,
  phoneNum
}: IAuthenticationNumber) => {
  const res = await request<IPostCheckIdRes>({
    method: 'POST',
    url: '/api/common/signup/phone/verification/confirm',
    data: {
      code,
      phoneNum
    }
  });
  return res.data;
};

interface ICheckCorporate {
  b_no: string;
  start_dt: string;
  p_nm: string;
  b_nm: string;
}

export const verifyCoporate = async ({
  b_no,
  start_dt,
  p_nm,
  b_nm
}: ICheckCorporate) => {
  try {
    const res = await request<ApiResponse<{}>>({
      method: 'POST',
      url: '/api/common/signup/corporate/verification',
      data: {
      b_no,
      start_dt,
      p_nm,
      b_nm
    }
    });
    toast.success(res.data.message);
    return res.data;
  } catch (error: any) {
    toast.error(error.response?.data?.message || '기관인증 실패');
    throw error;
  }
};

export interface PhoneVerificationDTO {
  code: string;
  phoneNum: string;
}

export interface IndividualSignUpDTO {
  username: string;
  password: string;
  passwordCheck: string;
  name: string;
  birth?: string; // 선택적 필드로 지정
  address?: string; // 선택적 필드로 지정
  email: string; // 정규식 패턴은 런타임 유효성 검사 시 적용
  phoneVerificationDTO: PhoneVerificationDTO;
}

export const individualSignup = async (form: IndividualSignUpDTO) => {
  try {
    const res = await request<ApiResponse<ILoginData>>({
      method: 'POST',
      url: '/api/common/signup/individual',
      data: form
    });
    return res;
  } catch (error: any) {
    throw {
      response: {
        data: {
          message: error.response?.data?.message || '회원가입에 실패했습니다.'
        }
      }
    };
  }
};
export interface PhoneVerificationDTO {
  code: string;
  phoneNum: string;
}

export interface CorporateVerificationDTO {
  b_no: string; // 사업자등록번호
  start_dt: string; // 개업일자
  p_nm: string; // 대표자명
  b_nm: string; // 회사명
}

export interface SignupCompanyRequest {
  username: string;
  password: string;
  passwordCheck: string;
  address: string;
  email: string;
  phoneVerificationDTO: PhoneVerificationDTO;
  corporateVerificationDTO: CorporateVerificationDTO;
}

export const companySignup = async (form: SignupCompanyRequest) => {
  try {
    const res = await request<ApiResponse<ILoginData>>({
      method: 'POST',
      url: '/api/common/signup/corporate',
      data: form
    });
    return res;
  } catch (error: any) {
    throw {
      response: {
        data: {
          message: error.response?.data?.message || '회원가입에 실패했습니다.'
        }
      }
    };
  }
};

export const getSubscription = async (token: string) => {
  try {
    const res = await request<ApiResponse<userSub>>({
      method: 'GET',
      url: '/api/program/use/subscription',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.data;
  } catch (error) {
    console.log('구독 잔여기간 조회 실패');
  }
};
export const getNotokenSubscription = async () => {
  try {
    const res = await request<ApiResponse<userSub>>({
      method: 'GET',
      url: '/api/program/use/subscription'
    });

    return res.data;
  } catch (error) {
    console.log('구독 잔여기간 조회 실패');
  }
};


export const editCompanyInfo = async ( { b_no,
  start_dt,
  p_nm,
  b_nm}: ICheckCorporate) => {
  try {
    const res = await request<ApiResponse<ILoginData>>({
      method: 'POST',
      url: '/api/my-page/account/business/verify',
      data: {
        p_nm: p_nm,
        b_nm: b_nm,
        b_no: b_no,
        start_dt: start_dt
      }
    });
    toast.success(res.data.message);
  } catch (error : any) {
    toast.error(error.response?.data?.message || '기관정보 수정 실패');
  }
};

