import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';

import { Player } from '../entities/player.entity';
import { Room } from '../../rooms/entities/room.entity';
import { User } from '../../../users/entities/user.entity';
import UpdatePlayerDto from '../dto/update-player.dto';




@Injectable()
export class PlayersService {

  // -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------

  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
  ) {}

  // -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------

  public async create(
    // createPlayerDto: CreatePlayerDto
    room: Room,
    user: User,
  )
      : Promise<Player>
  {
      // check if player for this user is already in room
      let player = await this.playersRepository.findOne({
          where: {user: user, room: room}
        })
      // if not: add player in room
      if (!player) {
        player = await this.addPlayer(room, user)
      }

    return player;
  }

  public findAll(): Promise<Player[]> {
    return this.playersRepository.find({
        relations: ["user", "room"]
    });
  }

  public async findOne(id: number): Promise<Player> {
    const player = await this.playersRepository.findOne(id, {
        relations: ["user", "room"]
    });
    if (!player) {
        throw new NotFoundException('Player not found.');
    }
    return player
  }

  public async findRoomNumber(playerId: number): Promise<number> {
    const player = await this.playersRepository.findOne(playerId, {
        relations: ["room"]
    });
    if (!player) {
        throw new NotFoundException('Player not found.');
    }
    return player.room.id
  }

  public async checkIfInGame(
		user : User
	)
		: Promise<Player>
	{
    const player = await this.playersRepository.findOne({
      relations: ["user", "room"],
      where: { winner: IsNull(), user: user }
    })

		return player;
	}


  public async update(id: number, playerDto: UpdatePlayerDto): Promise<Player> {
    const player = await this.playersRepository.save({
        id,
        ...playerDto
    })
    return this.findOne(player.id)
  }

  public async remove(id: number): Promise<void> {
    try {
        const player = await this.findOne(id)
        await this.playersRepository.remove(player);
    } catch (error) {
        throw new NotFoundException('Player not found.');
    }
  }

  // -------------------------------------------------------------------------
	// Private methods
	// -------------------------------------------------------------------------

  private async addPlayer(
    room: Room,
    user: User,
  ): Promise<Player> {

    // check if player in room to define position (left by default)
    let position = 'left'
    if (room.players?.length != 0) {
        position = room.players[0].position == "left" ? "right" : "left"
        console.log(position)
    }
    const player = this.playersRepository.create({
        position: position,
        user: user,
        room: room
      })
    await this.playersRepository.save(player)

    return player
  }
}
