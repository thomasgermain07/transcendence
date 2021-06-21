import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from 'src/users/users.module'

import { DatabaseConfigService } from './services/database-config.service'

import { ConfigModule } from '@nestjs/config'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Database connection
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
    }),
    // Api Modules
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
