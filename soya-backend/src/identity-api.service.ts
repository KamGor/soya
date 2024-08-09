import { Injectable } from '@nestjs/common';
import { IdentityApi } from '@ory/client';

@Injectable()
export class IdentityApiService extends IdentityApi {}
