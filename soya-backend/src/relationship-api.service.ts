import { Injectable } from '@nestjs/common';
import { RelationshipApi } from '@ory/client';

@Injectable()
export class RelationshipApiService extends RelationshipApi {}
