import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import  User  from './entities/user.entity'
import { UsersController } from './users.controller'
import { PlayersModule } from 'src/players/players.module'
import { RoomsModule } from 'src/rooms/rooms.module'

@Module({
  imports: [TypeOrmModule.forFeature([User]),
            PlayersModule,
            RoomsModule,
          ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
