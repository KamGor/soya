import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nano from 'nano';
import { ServerScope } from 'nano';

@Injectable()
export class CouchDBService {
  private server: ServerScope;
  constructor(private config: ConfigService) {
    this.server = nano({
      url: this.config.getOrThrow('LOG_DATABASE_URL'),
    });
  }

  public useDb<DocumentType>(name: string) {
    return this.server.use<DocumentType>(name);
  }

  public getDb(name: string) {
    return this.server.db.get(name);
  }

  public auth(username: string, password: string) {
    return this.server.auth(username, password);
  }

  public createDb(name: string) {
    return this.server.db.create(name);
  }
}
