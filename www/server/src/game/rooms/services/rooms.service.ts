import { Injectable }                             from '@nestjs/common';
import { NotFoundException, BadRequestException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository }       from 'typeorm';

import { Room, GameMode }                   from '../entities/room.entity';
import { User }                   from '../../../users/entities/user.entity';
import { Option, MapType, DifficultyLevel } from '../entities/option.entity';

import CreateRoomDto   from '../dto/create-room.dto';
import UpdateRoomDto   from '../dto/update-room.dto';
import CreateOptionDto from '../dto/create-option.dto';



@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    @InjectRepository(Option)
    private optionsRepository: Repository<Option>
  ) {}

  // create empty room with options
  public async create(
    createRoomDto: CreateRoomDto,
  )
      : Promise<Room>
  {
    // Init options: if no options in Dto, default values will be inserted
    const option = this.optionsRepository.create(createRoomDto?.option);

    // Create room
    const room = this.roomsRepository.create({
        ...createRoomDto,
        option: option,
        players: [],
    });
    await this.roomsRepository.save(room)
  
    return room;
  }

  findAll(): Promise<Room[]> {
    return this.roomsRepository.find({
        relations: ["option"]
    });
  }

  async findOne(id: number): Promise<Room> {
    const room = await this.roomsRepository.findOne(id, {
        relations: ["option", "players"]
    });
    if (!room) {
        throw new NotFoundException('Room not found.');
    }
    return room
  }

  async findOneByPlayerId(playerId: number): Promise<Room> {
    const room = await this.roomsRepository.createQueryBuilder("room")
      .leftJoinAndSelect("room.players", "players")
      .where("players.id = :id", { id: playerId })
      .getOne();

    return room
  }

  public async findOneIfActive(id: number): Promise<Room> {
    const room = await this.roomsRepository.findOne(id, {
        relations: ["option"]
    });
    if (!room) {
        throw new NotFoundException('Room not found.');
    }
    if (room && !room.locked ) {
        throw new BadRequestException('Room not locked.');
    }
    return room;
  }

  async findMatchOrCreate(
    mode: GameMode,
    options: CreateOptionDto,
    user: User
): Promise<Room> {
  let room = await this.findByModeAndOptions(mode, user, options)
  if(!room) {
      console.log('NO CORRESPONDING ROOM FOUND - CREATING NEW')
      let roomDto: CreateRoomDto = { mode }
      if (options) {
          roomDto.option = { ...options }
      }
      console.log(roomDto)
      room = await this.create(roomDto)
  }
  return room 
}

async findByModeAndOptions(
  mode: GameMode,
  user: User,
  options?: CreateOptionDto,
  ): Promise<Room> {
  const optionsDefault: CreateOptionDto = {
      map: MapType.DEFAULT,
      difficulty: DifficultyLevel.EASY,
      powerUps: false
  }
  let room = null;
  if (mode === GameMode.LADDER) {
    room = await this.roomsRepository.createQueryBuilder("room")
    .leftJoinAndSelect("room.players", "players")
    .leftJoinAndSelect("players.user", "users")
    .where("room.mode = :mode", { mode: mode })
    .andWhere("room.locked = :locked", { locked: false })
    .andWhere(`"users"."ladderLevel" BETWEEN :begin AND :end`, {
      begin: user.ladderLevel - 1, end: user.ladderLevel + 1} )
    .getOne();
  } else {
    // else find match for Duel:
    if (!options) {
      console.log('IN FIND -> NO OPTIONS')
    }
    const optionDto = options || optionsDefault
    room = await this.roomsRepository.createQueryBuilder("room")
    .leftJoinAndSelect("room.option", "option")
    .leftJoinAndSelect("room.players", "players")
    .where("room.mode = :mode", { mode: mode })
    .andWhere("room.locked = :locked", { locked: false })
    .andWhere("option.map = :map", { map: optionDto.map })
    .andWhere("option.difficulty = :diff", { diff: optionDto.difficulty })
    .andWhere("option.powerUps = :pow", { pow: optionDto.powerUps })
    .getOne();
  }
  return room
}

  public async update(id: number, roomDto: UpdateRoomDto): Promise<Room> {
    const room = await this.roomsRepository.save({
        id,
        ...roomDto
    })
    return this.findOne(room.id)
  }

  async remove(id: string): Promise<void> {
    await this.roomsRepository.delete(id);
  }

  async clearAll(): Promise<void> {
    await this.roomsRepository.createQueryBuilder()
        .delete()
        .execute()
  }
}