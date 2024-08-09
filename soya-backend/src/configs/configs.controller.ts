import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ConfigManager } from 'src/config-manager/config-manager.service';
import { CreateConfigDTO } from './create-config.dto';
import { UpdateConfigDTO } from './update-config.dto';
import { SubscribeConfigsDTO } from './subscribe-configs.dto';
import { filter, map, merge, of } from 'rxjs';
import { IsPublic } from 'src/authentication/is-public.decorator';
import { FastifyReply } from 'fastify';
import { AccessLogService } from 'src/access-log/access-log.service';

@Controller('configs')
export class ConfigsController {
  constructor(
    private configManager: ConfigManager,
    private accessLog: AccessLogService,
  ) {}

  @Get()
  public getConfigs(
    @Query('configName', new ParseArrayPipe({ optional: true }))
    configFieldNames: string[],
    @Query('page', new ParseIntPipe({ optional: true }))
    page: number,
    @Query('itemsPerPage', new ParseIntPipe({ optional: true }))
    itemsPerPage: number,
    @Query('search')
    search: string,
  ) {
    if (configFieldNames) {
      return this.configManager.getConfigsByName(configFieldNames);
    } else {
      return this.configManager.getConfigs(page, itemsPerPage, search);
    }
  }

  @Put()
  @IsPublic()
  public async subscribeConfigs(
    @Body() subscribeEventsDTO: SubscribeConfigsDTO,
    @Res() res: FastifyReply,
  ) {
    for (const [name, value] of Object.entries(res.getHeaders())) {
      res.raw.setHeader(name, value);
    }
    res.raw.setHeader('Content-Type', 'text/event-stream');
    res.raw.setHeader('Cache-Control', 'no-cache');
    res.raw.setHeader('Connection', 'keep-alive');
    res.raw.setHeader('Pragma', 'no-cache');
    res.raw.setHeader('Expire', '0');
    res.raw.flushHeaders();

    const { configs, missingConfigs } =
      await this.configManager.getConfigsByName(subscribeEventsDTO.configs);
    const observable = this.configManager.getObservable();

    const $subscription = merge<
      {
        type: 'MODIFICATION' | 'DELETION' | 'CREATION' | 'INITATION';
        keys: string[];
        configs: {
          [name: string]: any;
        };
        missingConfigs: string[];
      }[]
    >(
      observable,
      of({
        missingConfigs,
        configs: configs.reduce<Record<string, any>>((acc, config) => {
          acc[config.id] = config.configValues[0].value;
          return acc;
        }, {}),
        type: 'INITATION',
        keys: configs.map((config) => config.id),
      }),
    )
      .pipe(
        filter((event) => {
          const configNames = Object.keys(event.configs);
          if (
            configNames.some((name) =>
              subscribeEventsDTO.configs.includes(name),
            ) ||
            event.missingConfigs.some((missing) =>
              subscribeEventsDTO.configs.includes(missing),
            )
          ) {
            return true;
          }
          return false;
        }),
      )
      .pipe(map((value) => ({ data: value })))
      .subscribe((data) => {
        // const date = new Date();
        // for (const what of data.data.keys) {
        //   this.accessLog.wrtieAccess(what, date, 'anonymous');
        // }
        res.raw.write(`data: ${JSON.stringify(data.data)}\n\n`);
      });

    res.raw.on('close', () => {
      $subscription.unsubscribe();
      res.raw.end();
    });
  }

  @Get(':configName')
  public getConfig(@Param('configName') configName: string) {
    return this.configManager.getConfigsByName([configName]);
  }

  @Post()
  public createConfig(@Body() createConfig: CreateConfigDTO) {
    return this.configManager.createConfigFields(createConfig.configs);
  }

  @Delete(':configId')
  public deleteConfig(
    @Param('configId')
    configId: string,
  ) {
    return this.configManager.deleteConfigFields([configId]);
  }

  @Delete()
  public deleteConfigs(
    @Query('configIds', ParseArrayPipe)
    configIds: string[],
  ) {
    return this.configManager.deleteConfigFields(configIds);
  }

  @Put(':configName')
  public updateConfigs(
    @Body() updateConfig: UpdateConfigDTO,
    @Param('configName') configName: string,
  ) {
    return this.configManager.updateConfigField(
      updateConfig.configs.map<{
        name: string;
        newName?: string;
        newValue?: string;
      }>((config) => {
        return Object.assign(
          {
            name: configName,
          },
          config,
        );
      }),
    );
  }
}
