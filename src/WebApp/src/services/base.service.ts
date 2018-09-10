import { AxiosPromise } from 'axios';

export abstract class BaseService {
  protected readonly api = 'http://localhost:5000/api';

  public async tryRequest(req: AxiosPromise<any>) {
    try {
      const res = await req;
      return res.data;
    } catch (error) {
      this.handleError(error.response);
    }
  }

  protected handleError(error: any) {
    const applicationError = error && error.headers['Application-Error'];

    if (applicationError) {
      throw applicationError;
    }

    let modelStateErrors: any = '';

    if (error && error.data) {
      for (const key in error.data) {
        if (error.data[key]) {
          modelStateErrors += error.data[key] + '\n';
        }
      }
    }

    modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;
    throw modelStateErrors || 'Server error';
  }
}
