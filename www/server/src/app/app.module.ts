import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DatabaseConfigService } from './services/database-config.service'

import { UsersModule } from './users/users.module';

import { AuthModule } from './auth/auth.module';

import { AppController } from './app.controller'; 

@Module({
  imports: [
    // Database connection
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
    }),
    UsersModule,
    AuthModule,
    // Api Modules
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
