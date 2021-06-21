import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DatabaseConfigService } from './services/database-config.service'

@Module({
  imports: [
    // Database connection
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
    }),
    // Api Modules
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
