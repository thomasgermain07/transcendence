import { Module }         from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule }      from '@nestjs/jwt'
import { HttpModule }     from '@nestjs/axios'

import { UsersModule } from "src/users/users.module";

import { AuthService }         from "./services/auth.service";
import { CookiesService }      from "./services/cookies.service";
import { LocalStrategy }       from "./strategies/local.strategy";
import { JwtAuthStrategy }     from "./strategies/jwt-auth.strategy";
import { JwtRefreshStrategy }  from "./strategies/jwt-refresh.strategy";
import { OAuthMarvinStrategy } from "./strategies/oauth-marvin.strategy";
import { AuthController }      from "./controllers/auth.controller";

@Module({
	imports: [
		// Externs
		HttpModule,
		PassportModule,
		JwtModule.register({}),
		// Modules
		UsersModule,
	],
	controllers: [
		AuthController,
	],
	providers: [
		// Services
		AuthService,
		CookiesService,
		// Strategies
		LocalStrategy,
		JwtAuthStrategy,
		JwtRefreshStrategy,
		OAuthMarvinStrategy,
	],
	exports: [
		// Services
		AuthService,
		CookiesService,
		// Strategies
		LocalStrategy,
		JwtAuthStrategy,
		JwtRefreshStrategy,
		OAuthMarvinStrategy,
	]
})
export class AuthModule {}
