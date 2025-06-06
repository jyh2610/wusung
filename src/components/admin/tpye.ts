export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Member {
  memberId: number;
  username: string;
  name: string;
  userType: string;
  phoneNumber: string;
  email: string;
  createdAt: string;
  isWithdrawn: boolean;
  withdrawAt: string | null;
  isVip: boolean | null;
  subscriptionEndDate: string | null;
}
export interface MemberListParams {
  page: number;
  size: number;
  sort: string;
  direction: string;
  search: string;
}
export interface IMemberDetail {
  memberId: number;
  username: string;
  name: string;
  phoneNumber: string;
  email: string;
  userType: string;
  role: string;
  address: string;
  profilePictureUrl: string | null;
  representativeName: string | null;
  businessRegistrationNumber: string | null;
  birthOrEstablishmentDate: string;
  createdAt: string;
  updatedAt: string;
  isWithdrawn: boolean;
  withdrawAt: string | null;
  isVip: boolean | null;
  subscriptionEndDate: string | null;
}
