import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmConfig } from './configs/typeorm.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LoggerInterceptor } from './interceptors/logger.interceptors';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './configs/wiston.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig),  WinstonModule.forRoot(winstonConfig) ,UsersModule, AuthModule],
  controllers: [],
  providers: [ { provide: APP_INTERCEPTOR, useClass: LoggerInterceptor } ],
})
export class AppModule {}
