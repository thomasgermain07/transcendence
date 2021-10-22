import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';

import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { ChatModule } from 'src/chat/chat.module';
import { RelationsModule } from 'src/relations/relations.module';
import { GameModule } from 'src/game/game.module';
import { DMModule } from 'src/direct_message/dm.module';

import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { DatabaseConfigService } from './services/database-config.service';
import { AppController } from './controllers/app.controller';

@Module({
	imports: [
		// Database connection
		TypeOrmModule.forRootAsync({
			useClass: DatabaseConfigService,
		}),
		// Jobs
		ScheduleModule.forRoot(),
		// Users' Avatars
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', '..', 'public'),
			exclude: ['/api*'],
		}),
		// Api Modules
		AuthModule,
		UsersModule,
		ChatModule,
		GameModule,
		DMModule,
		RelationsModule,
	],
	controllers: [AppController],
	providers: [
		// Enable `class-tranformer` globally
		// (@Exclude, @Type, @Transform, ... in entities)
		{
			provide: APP_INTERCEPTOR,
			useClass: ClassSerializerInterceptor,
		},
		// Filters
		{
			provide: APP_FILTER,
			useClass: GlobalExceptionFilter,
		},
	],
	exports: [],
})
export class AppModule {}
