import { Injectable } from '@nestjs/common';
import { PermissionApi } from '@ory/client';

@Injectable()
export class PermissionApiService extends PermissionApi {}
