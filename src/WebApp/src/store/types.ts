import IProfile from '@/models/profile';

export interface IRootState {
  version: string;
  layout: string;
}

export interface IAuthState {
  token: string;
  expiresIn: string;
  status: string;
}

export interface IUserState {
  profile: IProfile | null;
  status: string;
}
