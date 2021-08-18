import { Injectable }            from '@nestjs/common'
import { TypeOrmModuleOptions }  from '@nestjs/typeorm'
import { TypeOrmOptionsFactory } from '@nestjs/typeorm'

@Injectable()
export class DatabaseConfigService
	implements TypeOrmOptionsFactory
{

	createTypeOrmOptions()
		: TypeOrmModuleOptions
	{
		return {
			type: 'postgres',
			host: process.env.DB_HOST,
			port: parseInt(process.env.DB_PORT),

			username: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME,

			synchronize: true,
			autoLoadEntities: true,
			// logging: true,
		}
	}

}
