import { APP_INTERCEPTOR }            from '@nestjs/core'
import { Module }                     from '@nestjs/common'
import { ClassSerializerInterceptor } from '@nestjs/common'
import { TypeOrmModule }              from '@nestjs/typeorm'

import { AuthModule }  from 'src/auth/auth.module'
import { UsersModule } from 'src/users/users.module'
import { ChatModule }  from 'src/chat/chat.module'

import { DatabaseConfigService } from './services/database-config.service'

@Module({
	imports: [
		// Database connection
		TypeOrmModule.forRootAsync({
			useClass: DatabaseConfigService,
		}),
		// Api Modules
		AuthModule,
		UsersModule,
		ChatModule,
	],
	controllers: [],
	providers: [
		// Enable `class-tranformer` globally
		// (@Exclude, @Type, @Transform, ... in entities)
		{
			provide: APP_INTERCEPTOR,
			useClass: ClassSerializerInterceptor,
		},
	],
})
export class AppModule {}
