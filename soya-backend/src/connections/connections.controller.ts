import {
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Query,
} from '@nestjs/common';

@Controller('connections')
export class ConnectionsController {
  @Get()
  public getConnections() {}

  @Delete(':connectionId')
  public deleteConnection(@Param('connectionId') connectionId: string) {}

  @Delete()
  public deleteConnections(@Query('ids', ParseArrayPipe) ids: string[]) {}
}
