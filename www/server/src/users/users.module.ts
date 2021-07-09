import { Module }        from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User }               from './entities/user.entity'
import { UsersService }       from './services/users.service'
import { UsersController }    from './controllers/users.controller'
import { IsUniqueConstraint } from './decorators/is-unique.decorator'

@Module({
	imports: [
		TypeOrmModule.forFeature([User])
	],
	controllers: [
		UsersController
	],
	providers: [
		// Services
		UsersService,
		// Decorators
		IsUniqueConstraint,
	],
	exports: [
		UsersService,
	],
})
export class UsersModule {}
