import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { UserRepository } from '../users/users.repository';


@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, LocalStrategy, UserRepository],
})
export class AuthModule {}
