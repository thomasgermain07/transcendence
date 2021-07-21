import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Room }   from './entities/room.entity';
import { Option } from './entities/option.entity';

import { RoomsService }    from './services/rooms.service';
import { PurgeService }    from './services/purge.service';
import { RoomsController } from './controllers/rooms.controller';



@Module({
  imports: [
    TypeOrmModule.forFeature([Room, Option]),
  ],
  providers: [
    RoomsService,
    PurgeService,
  ],
  controllers: [RoomsController],
  exports: [RoomsService]
})
export class RoomsModule {}