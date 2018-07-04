import axios from 'axios';
import ICredentials from '@/models/credentials';
import { BaseService } from './base.service';

class AuthService extends BaseService {
  private static instance: AuthService;

  private constructor() {
    super();
  }

  public static get Instance() {
    // Do you need arguments? Make it a regular method instead.
    return this.instance || (this.instance = new this());
  }

  public async login(credentials: ICredentials) {
    return await this.tryRequest(
      axios.post(`${this.api}/auth/login`, credentials),
    );
  }
}

// export a singleton instance in the global namespace
export const authService = AuthService.Instance;
