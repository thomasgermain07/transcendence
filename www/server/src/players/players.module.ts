import { Module } from '@nestjs/common'
import { PlayersService } from './players.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import  Player  from './entities/player.entity'
import { PlayersController } from './players.controller'
import { UsersModule } from 'src/users/users.module'

@Module({
  imports: [TypeOrmModule.forFeature([Player])],
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [PlayersService],
})
export class PlayersModule {}