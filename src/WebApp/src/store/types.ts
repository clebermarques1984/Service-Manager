import IProfile from '@/models/profile';

export interface IRootState {
  version: string;
  layout: string;
}

export interface IAuthState {
  auth_token: string;
  expires_in: number;
  status: string;
}

export interface IUserState {
  profile: IProfile | null;
  status: string;
}
