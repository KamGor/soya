import { Injectable } from '@nestjs/common';
import { FrontendApi } from '@ory/client';

@Injectable()
export class FrontendApiService extends FrontendApi {}
