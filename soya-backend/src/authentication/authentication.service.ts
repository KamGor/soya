import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { FrontendApiService } from 'src/frontend-api.service';
import { IdentityApiService } from 'src/identity-api.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private identityApi: IdentityApiService,
    private frotnendApi: FrontendApiService,
  ) {}

  public async getSession(sessionToken: string) {
    try {
      const response = await this.frotnendApi.toSession({
        cookie: `soya_session=${sessionToken}`,
      });

      return response.data;
    } catch (err) {
      if (
        err instanceof AxiosError &&
        err?.response?.data?.error?.code === 401
      ) {
        throw new UnauthorizedException(err.response.data.error.reason);
      }
    }
  }

  public async extendSession(sessionId: string) {
    try {
      const extended = await this.identityApi.extendSession({
        id: sessionId,
      });

      return extended.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(err.request);
        console.error(err.response.data);
      }
    }
  }
}
