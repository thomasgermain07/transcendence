import { APP_INTERCEPTOR }            from "@nestjs/core";
import { Module }                     from "@nestjs/common";
import { ClassSerializerInterceptor } from "@nestjs/common";
import { TypeOrmModule }              from "@nestjs/typeorm";
import { ServeStaticModule }          from "@nestjs/serve-static";
import { join }                       from "path";

import { AuthModule }  from "src/auth/auth.module";
import { UsersModule } from "src/users/users.module";

import { DatabaseConfigService } from "./services/database-config.service";

@Module({
	imports: [
		// Database connection
		TypeOrmModule.forRootAsync({
			useClass: DatabaseConfigService,
		}),
		// Users' Avatars
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', '..', 'public'),
			exclude: ['/api*'],
		}),
		// Api Modules
		AuthModule,
		UsersModule,
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
	exports: []
})
export class AppModule {}
