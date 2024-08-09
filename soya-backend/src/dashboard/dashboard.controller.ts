import { Controller, Get } from '@nestjs/common';
import { AccessLogService } from 'src/access-log/access-log.service';
import { ConfigManager } from 'src/config-manager/config-manager.service';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private configManager: ConfigManager,
    private accessLog: AccessLogService,
  ) {}

  @Get('last-accesed-configs')
  public getLastAccessedConfigs() {
    // this.accessLog.getLogs({
    //   what: 'app_lp_test',
    // });
  }

  @Get('last-configs-not-found')
  public getLastConfigsNotFound() {}

  @Get('last-modified-configs')
  public getLastModifiedConfigs() {}

  @Get('not-used-configs')
  public getNotUsedConfigsForLastThirtyDays() {}
}
