import axios from 'axios';
import { BaseService } from './base.service';

class ProfileService extends BaseService {
  private static instance: ProfileService;

  private constructor() {
    super();
  }

  public static get Instance() {
    // Do you need arguments? Make it a regular method instead.
    return this.instance || (this.instance = new this());
  }

  public async get() {
    return await this.tryRequest(axios.get(`${this.api}/profile/me`));
  }
}

// export a singleton instance in the global namespace
export const profileService = ProfileService.Instance;
