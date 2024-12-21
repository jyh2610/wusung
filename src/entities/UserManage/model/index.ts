import { create } from 'zustand';

type CommonState = {
  id: string;
  password: string;
  checkPassword: string;
  email: string;
  phoneNumber: string;
  address: string;
  detailAddress: string;
  termsOfUse: boolean;
  agreeIndividualData: boolean;
};

type IndividualState = CommonState & {
  name: string;
  birth: string;
};

type CorporateState = CommonState & {
  representativeName: string;
  institutionName: string;
  openingDate: string;
};

const useCommonStore = create<CommonState>(set => ({
  id: '',
  password: '',
  checkPassword: '',
  email: '',
  phoneNumber: '',
  address: '',
  detailAddress: '',
  termsOfUse: false,
  agreeIndividualData: false
}));

export const useIndividualStore = create<IndividualState>(set => ({
  ...useCommonStore.getState(),
  name: '',
  birth: ''
}));

export const useCorporateStore = create<CorporateState>(set => ({
  ...useCommonStore.getState(),
  representativeName: '',
  institutionName: '',
  openingDate: ''
}));
