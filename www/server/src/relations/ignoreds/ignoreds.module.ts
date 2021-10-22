import { Module }        from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ignored }            from './entities/ignored.entity';
import { IgnoredsService }    from "./services/ignoreds.service";
import { IgnoredsController } from "./controllers/ignoreds.controller";
import { UsersModule } from 'src/users/users.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Ignored]),
		UsersModule,
	],
	controllers: [
		IgnoredsController,
	],
	providers: [
		IgnoredsService,
	],
	exports: [
		IgnoredsService,
	]
})
export class IgnoredsModule {}
