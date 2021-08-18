import { Module }        from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ignored }            from './entities/ignored.entity';
import { IgnoredsService }    from "./services/ignoreds.service";
import { IgnoredsController } from "./controllers/ignoreds.controller";
import { UsersModule } from 'src/users/users.module';

@Module({
	imports: [
		// Database
		TypeOrmModule.forFeature([Ignored]),
		// Module
		UsersModule,
	],
	controllers: [
		IgnoredsController,
	],
	providers: [
		// Services
		IgnoredsService,
	],
	exports: [
		// Services
		IgnoredsService,
	]
})
export class IgnoredsModule {}
