import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository }       from 'typeorm';

import { Room, GameMode, GameState }        from '../entities/room.entity';
import { Option, MapType, DifficultyLevel } from '../entities/option.entity';
import { User }                             from 'src/users/entities/user.entity';

import CreateRoomDto   from '../dto/create-room.dto';
import UpdateRoomDto   from '../dto/update-room.dto';
import CreateOptionDto from '../dto/create-option.dto';




@Injectable()
export class RoomsService {

  // -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
  
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    @InjectRepository(Option)
    private optionsRepository: Repository<Option>
  ) {}

  // -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------

  public findAll(): Promise<Room[]> {
    return this.roomsRepository.find({
        relations: ["option"]
    });
  }

  public async findOne(id: number): Promise<Room> {
    const room = await this.roomsRepository.findOne(id, {
        relations: ["option", "players"]
    });
    if (!room) {
        throw new NotFoundException('Room not found.');
    }
    return room
  }

  public async findOneByPlayerId(playerId: number): Promise<Room> {
    const room = await this.roomsRepository.createQueryBuilder("room")
      .leftJoinAndSelect("room.players", "players")
      .where("players.id = :id", { id: playerId })
      .getOne();

    return room
  }

  public async findEmptyAndDelete(): Promise<void> {

    const rooms = await this.roomsRepository.find({
      where: { locked: false, state: GameState.WAITING }
    })

    const emptyRooms = rooms.filter(room => room.players.length === 0);

    await this.removeMultiple(emptyRooms)
  }

  public async findMatchOrCreate(
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
        room = await this.createEmpty(roomDto)
    }

    return room 
  }

  public async findAllByMode() : Promise<Room[]> {

    const rooms = await this.roomsRepository.createQueryBuilder("room")
      .leftJoinAndSelect("room.players", "players")
      .leftJoinAndSelect("players.user", "users")
      .where("room.mode IN (:...modes)", { modes: [GameMode.DUEL, GameMode.LADDER] })
      .andWhere("room.state = :state", { state: GameState.PLAYING })
      .getMany()

    return rooms;
  }

  public async update(id: number, roomDto: UpdateRoomDto): Promise<Room> {
    const room = await this.roomsRepository.save({
        id,
        ...roomDto
    })
    return this.findOne(room.id)
  }

  public async remove(id: string): Promise<void> {
    await this.roomsRepository.delete(id);
  }

  public async clearAll(): Promise<void> {
    await this.roomsRepository.createQueryBuilder()
        .delete()
        .execute()
  }

  // -------------------------------------------------------------------------
	// Private methods
	// -------------------------------------------------------------------------

  private async findByModeAndOptions(
    mode: GameMode,
    user: User,
    options?: CreateOptionDto,
    ): Promise<Room> {

    let room = null;

    if (mode === GameMode.LADDER) {
      room = await this.findMatchOnLadder(mode, user)

    } else {
      room = await this.findMatchOnDuel(mode, user, options)
    }

    return room
  }

  private async findMatchOnLadder(
    mode: GameMode,
    user: User,
  ) : Promise<Room> {

    const room = await this.roomsRepository.createQueryBuilder("room")
      .leftJoinAndSelect("room.players", "players")
      .leftJoinAndSelect("players.user", "users")
      .where("room.mode = :mode", { mode: mode })
      .andWhere("room.locked = :locked", { locked: false })
      .andWhere(`"users"."ladderLevel" BETWEEN :begin AND :end`, {
        begin: user.ladderLevel - 1, end: user.ladderLevel + 1} )
      .getOne();

    return room
  }

  private async findMatchOnDuel(
    mode: GameMode,
    user: User,
    options?: CreateOptionDto,
  ) : Promise<Room> {

    // if (!options) {
    //   console.log('IN FIND -> NO OPTIONS')
    // }

    const optionsDefault: CreateOptionDto = {
      map: MapType.DEFAULT,
      difficulty: DifficultyLevel.EASY,
      powerUps: false
    }

    const optionDto = options || optionsDefault

    const room = await this.roomsRepository.createQueryBuilder("room")
      .leftJoinAndSelect("room.option", "option")
      .leftJoinAndSelect("room.players", "players")
      .where("room.mode = :mode", { mode: mode })
      .andWhere("room.locked = :locked", { locked: false })
      .andWhere("option.map = :map", { map: optionDto.map })
      .andWhere("option.difficulty = :diff", { diff: optionDto.difficulty })
      .andWhere("option.powerUps = :pow", { pow: optionDto.powerUps })
      .getOne();

    return room
  }

  private async createEmpty(
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

  private async removeMultiple(rooms: Room[]): Promise<void> {
    await this.roomsRepository.remove(rooms);
  }
}
