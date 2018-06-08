export interface IRootState {
  version: string;
}

export interface IAuthState {
  token: string;
  status: string;
}

export interface IUserState {
  profile: any;
  status: string;
}
