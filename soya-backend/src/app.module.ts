import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { ConfigManager } from './config-manager/config-manager.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { TagsManagerService } from './tags-manager/tags-manager.service';
import { ConfigsController } from './configs/configs.controller';
import { UsersManagerService } from './users-manager/users-manager.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './authentication/auth.guard';
import { UserMiddleware } from './user/user.middleware';
import { CookieParserMiddleware } from '@nest-middlewares/cookie-parser';
import { IdentityApiService } from './identity-api.service';
import { Configuration } from '@ory/client';
import { FrontendApiService } from './frontend-api.service';
import { PermissionApiService } from './permission-api.service';
import { RelationshipApiService } from './relationship-api.service';
import { CouchDBService } from 'src/couch-db.service';
import { AccessLogService } from './access-log/access-log.service';
import { TagsController } from './tags/tags.controller';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { ConnectionsController } from './connections/connections.controller';
import { ConnectionsManagerService } from './connections-manager/connections-manager.service';
import { DashboardController } from './dashboard/dashboard.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DevtoolsModule.register({
      http: true,
    }),
  ],
  controllers: [
    AppController,
    ConfigsController,
    TagsController,
    ConnectionsController,
    DashboardController,
  ],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    {
      provide: IdentityApiService,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const identityApiConfig = new Configuration({
          basePath: config.getOrThrow('PRIVATE_KRATOS_API_URL'),
        });
        return new IdentityApiService(identityApiConfig);
      },
    },
    {
      provide: FrontendApiService,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const frontendApiConfig = new Configuration({
          basePath: config.getOrThrow('PUBLIC_KRATOS_API_URL'),
        });
        return new FrontendApiService(frontendApiConfig);
      },
    },
    {
      provide: PermissionApiService,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const permissionApiConfig = new Configuration({
          basePath: config.getOrThrow('PUBLIC_KETO_API_URL'),
        });
        return new PermissionApiService(permissionApiConfig);
      },
    },
    {
      provide: RelationshipApiService,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const relationshipApiConfig = new Configuration({
          basePath: config.getOrThrow('PRIVATE_KETO_API_URL'),
        });
        return new RelationshipApiService(relationshipApiConfig);
      },
    },
    CouchDBService,
    AuthenticationService,
    ConfigManager,
    PrismaService,
    TagsManagerService,
    UsersManagerService,
    AccessLogService,
    ConnectionsManagerService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CookieParserMiddleware).forRoutes('*');
    consumer.apply(UserMiddleware).forRoutes('*');
  }
}
