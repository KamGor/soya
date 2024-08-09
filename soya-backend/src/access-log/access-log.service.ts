import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CouchDBService } from 'src/couch-db.service';
import { MangoQuery } from 'nano';

@Injectable()
export class AccessLogService {
  constructor(
    private logServer: CouchDBService,
    config: ConfigService,
  ) {
    logServer.auth('admin', 'admin');
    logServer.useDb(config.getOrThrow('LOG_DATABASE_NAME'));
  }

  public async wrtieAccess(what: string, when: Date, who: string) {
    return this.logServer
      .useDb<{ what: string; who: string; when: Date }>('config-access')
      .insert({
        what,
        when,
        who,
      });
  }

  public bulkWriteAccess(logs: { what: string; when: Date; who: string }[]) {
    for (const log of logs) {
      this.wrtieAccess(log.what, log.when, log.who);
    }
  }

  public getLogs(query: MangoQuery & { what: string }) {
    return this.logServer.useDb(query.what.toLowerCase()).find(query);
  }
}
