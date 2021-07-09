import { Module, HttpModule }  from '@nestjs/common'
import { PassportModule }      from '@nestjs/passport'
import { JwtModule }           from '@nestjs/jwt'

import { UsersModule } from 'src/users/users.module'

import { AuthService }             from './services/auth.service'
import { CookiesService }          from './services/cookies.service'
import { LocalStrategy }           from './strategies/local.strategy'
import { JwtStrategy }             from './strategies/jwt-auth.strategy'
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy'
import { WsJwtStrategy }           from './strategies/ws-jwt.strategy'
import { AuthController }          from './controllers/auth.controller'
import { MarvinAuthStrategy }      from './strategies/marvin-auth.strategy'

@Module({
  imports: [
    PassportModule,
    HttpModule,
    JwtModule.register({}),
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
    JwtStrategy,
    JwtRefreshTokenStrategy,
    MarvinAuthStrategy,
    AuthService,
    CookiesService,
  ],
  exports: []
})
export class AuthModule {}
