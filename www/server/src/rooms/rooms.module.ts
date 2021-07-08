import { Module } from '@nestjs/common'
import { RoomsService } from './rooms.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import  Room  from './entities/room.entity'
import { RoomsController } from './rooms.controller'
import { UsersModule } from 'src/users/users.module'
import { PlayersModule } from 'src/players/players.module'

@Module({
  imports: [TypeOrmModule.forFeature([Room]), PlayersModule],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}