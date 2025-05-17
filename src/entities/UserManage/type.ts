export interface IPostCheckIdRes {
  data: string;
  message: string;
}

export interface ILoginData {
  userName: string;
  password: string;
}

export interface IForm {
  verificationCode: string | undefined;
  id: string;
  password: string;
  passwordConfirm: string;
  representativeName: string;
  companyName: string;
  corporateNumber: string;
  openingDate: string;
  name: string;
  address: string;
  detailAddress: string;
  phone: string;
  phoneCode: string;
  email: string;
  termOfUse: [boolean, boolean];
  emailDomain: string;
}

export interface userSub {
  endDate: string;
  isVip: boolean;
}
