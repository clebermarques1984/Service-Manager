import axios from 'axios';
import IUserRegistration from '@/models/user.registration';
import { BaseService } from './base.service';

class AccountService extends BaseService {
  private static instance: AccountService;

  private constructor() {
    super();
  }

  public static get Instance() {
    // Do you need arguments? Make it a regular method instead.
    return this.instance || (this.instance = new this());
  }

  public async register(userRegistration: IUserRegistration) {
    return await this.tryRequest(
      axios.post(`${this.api}/accounts`, userRegistration),
    );
  }
}

// export a singleton instance in the global namespace
export const accountService = AccountService.Instance;
