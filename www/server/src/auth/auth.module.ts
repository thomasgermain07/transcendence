import { Module }  from '@nestjs/common'
import { PassportModule }      from '@nestjs/passport'
import { JwtModule }           from '@nestjs/jwt'
import { HttpModule }           from '@nestjs/axios'

import { UsersModule } from 'src/users/users.module'

import { AuthService }             from './services/auth.service'
import { CookiesService }          from './services/cookies.service'
import { LocalStrategy }           from './strategies/local.strategy'
import { JwtStrategy }             from './strategies/jwt-auth.strategy'
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy'
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
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    MarvinAuthStrategy,
    AuthService,
    CookiesService,
  ],
})
export class AuthModule {}
