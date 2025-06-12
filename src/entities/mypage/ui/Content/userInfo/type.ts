export interface UserInfo {
  profilePictureUrl: string | null;
  username: string;
  name: string;
  birthOrEstablishmentDate: string;
  address: string;
  email: string;
  phoneNumber: string;
}

export interface UserInfoResponse {
  info: UserInfo;
  UserType: string;
}
