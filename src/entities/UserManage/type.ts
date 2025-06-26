export interface IPostCheckIdRes {
  data: string;
  message: string;
}

export interface ILoginData {
  userName: string;
  password: string;
}

export interface IFormCompany {
  verificationCode: string;
  id: string;
  password: string;
  passwordConfirm: string;
  representativeName: string;
  companyName: string;
  corporateNumber: string;
  openingDate: string;
  address: string;
  detailAddress: string;
  phone: string;
  phoneCode: string;
  email: string;
  emailId: string;
  termOfUse: [boolean, boolean];
  emailDomain: string;
}

export interface IFormIndividual {
  verificationCode: string;
  id: string;
  password: string;
  passwordConfirm: string;
  name: string;
  address: string;
  detailAddress: string;
  phone: string;
  email: string;
  emailId: string;
  termOfUse: [boolean, boolean];
  emailDomain: string;
  birth: {
    year: string;
    month: string;
    day: string;
  };
}

export interface userSub {
  endDate: string;
  isVip: boolean;
}
