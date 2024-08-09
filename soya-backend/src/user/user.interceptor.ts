import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/authentication/authentication.service';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(private auth: AuthenticationService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    console.log('interceptor');
    try {
      const sessionToken = request.cookies.soya_session;
      const session = await this.auth.getSession(sessionToken);
      request.user = session.identity;
      request.session = session;
    } catch (err) {
      if (!(err instanceof UnauthorizedException)) {
        console.error(err);
      }
    }

    return next.handle();
  }
}
