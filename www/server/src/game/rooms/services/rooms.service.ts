import { Injectable, NotFoundException } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Room } from '../entities/room.entity'
import { GameMode, GameState } from '../../enum/enum'
import { MapType, DifficultyLevel } from '../../enum/enum'
import { Option } from '../entities/option.entity'
import { User } from 'src/users/entities/user.entity'

import CreateRoomDto from '../dto/create-room.dto'
import UpdateRoomDto from '../dto/update-room.dto'
import CreateOptionDto from '../dto/create-option.dto'

@Injectable()
export class RoomsService {
  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------

  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    @InjectRepository(Option)
    private optionsRepository: Repository<Option>,
  ) {}

  // -------------------------------------------------------------------------
  // Public methods
  // -------------------------------------------------------------------------

  public findAll(): Promise<Room[]> {
    return this.roomsRepository.find({
      relations: ['option'],
    })
  }

  public async findOne(id: number): Promise<Room> {
    const room = await this.roomsRepository.findOne(id, {
      relations: ['option', 'players'],
    })
    if (!room) {
      throw new NotFoundException('Room not found.')
    }
    return room
  }

  public async findOneByPlayerId(playerId: number): Promise<Room> {
    const room = await this.roomsRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.option', 'option')
      .leftJoinAndSelect('room.players', 'players')
      .where('players.id = :id', { id: playerId })
      .getOne()

    return room
  }

  public async findEmptyAndDelete(): Promise<void> {
    const rooms = await this.roomsRepository.find({
      where: { locked: false, state: GameState.WAITING },
    })

    const emptyRooms = rooms.filter((room) => room.players.length === 0)

    await this.removeMultiple(emptyRooms)
  }

  public async findMatchOrCreate(
    mode: GameMode,
    options: CreateOptionDto,
    user: User,
    range: number,
  ): Promise<Room> {
    let room = await this.findByModeAndOptions(mode, user, options, range)

    if (!room) {
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

  public async findByModeAndOptions(
    mode: GameMode,
    user: User,
    options?: CreateOptionDto,
    range?: number,
  ): Promise<Room> {
    let room = null

    if (mode === GameMode.LADDER) {
      room = await this.findMatchOnLadder(user, range)
    } else {
      room = await this.findMatchOnDuel(options)
    }

    return room
  }

  public async findMatchOnLadder(user: User, range: number): Promise<Room> {
    const room = await this.roomsRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.players', 'players')
      .leftJoinAndSelect('players.user', 'users')
      .where('room.mode = :mode', { mode: GameMode.LADDER })
      .andWhere('room.locked = :locked', { locked: false })
      .andWhere(`"users"."ladderLevel" BETWEEN :begin AND :end`, {
        begin: user.ladderLevel - range,
        end: user.ladderLevel + range,
      })
      .getOne()

    return room
  }

  public async findMatchOnDuel(options?: CreateOptionDto): Promise<Room> {
    const optionsDefault: CreateOptionDto = {
      map: MapType.DEFAULT,
      difficulty: DifficultyLevel.EASY,
      powerUps: false,
    }

    const optionDto = options || optionsDefault

    const room = await this.roomsRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.option', 'option')
      .leftJoinAndSelect('room.players', 'players')
      .where('room.mode = :mode', { mode: GameMode.DUEL })
      .andWhere('room.locked = :locked', { locked: false })
      .andWhere('option.map = :map', { map: optionDto.map })
      .andWhere('option.difficulty = :diff', { diff: optionDto.difficulty })
      .andWhere('option.powerUps = :pow', { pow: optionDto.powerUps })
      .orderBy('players')
      .getOne()

    return room
  }

  public async findAllByMode(mode: GameMode): Promise<Room[]> {
    const rooms = await this.roomsRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.players', 'players')
      .leftJoinAndSelect('players.user', 'users')
      .where('room.mode = :mode', { mode: mode })
      .andWhere('room.state = :state', { state: GameState.PLAYING })
      .getMany()

    return rooms
  }

  public async findAllWinsByUser(user: User): Promise<Room[]> {
    const rooms = await this.roomsRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.option', 'option')
      .leftJoinAndSelect('room.players', 'players')
      .leftJoinAndSelect('players.user', 'users')
      .where('room.mode != :mode', { mode: GameMode.PRIVATE })
      .andWhere('players.user.id = :userId', { userId: user.id })
      .andWhere('players.winner = :winner', { winner: true })
      .getMany() // TODO: replace by getCount

    return rooms
  }

  public async findWinsByUserInMapDuel(user: User): Promise<boolean> {
    const totalWinsPerMap = await this.roomsRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.option', 'option')
      .leftJoinAndSelect('room.players', 'players')
      .leftJoinAndSelect('players.user', 'users')
      .where('room.mode = :mode', { mode: GameMode.DUEL })
      .andWhere('players.user.id = :userId', { userId: user.id })
      .andWhere('players.winner = :winner', { winner: true })
      .select('option.map')
      .groupBy('option.map')
      .getRawMany()

    if (totalWinsPerMap.length === 3) return true
    return false
  }

  public async findAllMatchPlayingByUser(user: User): Promise<Room[]> {
    const rooms = await this.roomsRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.players', 'players')
      .leftJoinAndSelect('players.user', 'users')
      .where('room.state IN (:...states)', {
        states: [GameState.PLAYING, GameState.PAUSE],
      })
      .andWhere('players.user.id = :userId', { userId: user.id })
      .getMany()

    return rooms
  }

  public async update(id: number, roomDto: UpdateRoomDto): Promise<Room> {
    const room = await this.roomsRepository.save({
      id,
      ...roomDto,
    })
    return this.findOne(room.id)
  }

  public async remove(room: Room): Promise<void> {
    await this.roomsRepository.delete(room.id)
  }

  public async clearAll(): Promise<void> {
    await this.roomsRepository.createQueryBuilder().delete().execute()
  }

  public async checkIfMatchFound(id: number): Promise<boolean> {
    const room = await this.roomsRepository.findOne(id)
    if (room && room.players.length == 2) {
      return true
    }
    return false
  }

  public async checkIfFromRoom(user: User, room: Room): Promise<boolean> {
    const result = await this.roomsRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.players', 'players')
      .leftJoinAndSelect('players.user', 'users')
      .where('room.id = :id', { id: room.id })
      .andWhere('players.user.id = :userId', { userId: user.id })
      .getOne()
    if (result) {
      return true
    }
    return false
  }

  public async createPrivate(createOptionDto: CreateOptionDto): Promise<Room> {
    const option = this.optionsRepository.create(createOptionDto)

    const room = this.roomsRepository.create({
      mode: GameMode.PRIVATE,
      option: option,
      locked: true,
      players: [],
    })
    await this.roomsRepository.save(room)

    return room
  }

  // -------------------------------------------------------------------------
  // Private methods
  // -------------------------------------------------------------------------

  private async createEmpty(createRoomDto: CreateRoomDto): Promise<Room> {
    // Init options: if no options in Dto, default values will be inserted
    const option = this.optionsRepository.create(createRoomDto?.option)

    // Create room
    const room = this.roomsRepository.create({
      ...createRoomDto,
      option: option,
      players: [],
    })
    await this.roomsRepository.save(room)

    return room
  }

  private async removeMultiple(rooms: Room[]): Promise<void> {
    await this.roomsRepository.remove(rooms)
  }
}
