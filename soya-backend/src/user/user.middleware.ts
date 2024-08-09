import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticationService } from 'src/authentication/authentication.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private auth: AuthenticationService) {}
  async use(req: any, res: any, next: () => void) {
    try {
      const sessionToken = req.cookies.soya_session;
      const session = await this.auth.getSession(sessionToken);
      req.user = session.identity;
      req.session = session;
    } catch (err) {
      if (!(err instanceof UnauthorizedException)) {
        console.error(err);
      }
    }
    next();
  }
}
