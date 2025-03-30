export interface ILoginData {
  userName: string;
  password: string;
}

export interface ILoginRes {
  username: 'string';
  accessToken: 'string';
  refreshToken: 'string';
}

export interface ILogoutData {
  message: string;
}
