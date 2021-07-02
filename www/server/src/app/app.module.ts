import { Module }        from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule }  from 'src/auth/auth.module'
import { UsersModule } from 'src/users/users.module'
import { ChatModule }  from 'src/chat/chat.modules'

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
	providers: [],
})
export class AppModule {}
