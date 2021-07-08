import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import  Player  from './entities/player.entity'
import { CreatePlayerDto } from './dto/create-player.dto'
import User from '../users/entities/user.entity'
import * as bcrypt from 'bcrypt'

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
  ) {}

  async createPlayer(playerData: CreatePlayerDto, user: User) {
    const newPlayer = await this.playersRepository.create({...playerData, user: user})
    await this.playersRepository.save(newPlayer)
    // console.log(newPlayer)
    // console.log(user);
    // if (!user.players)
    //   user.players = new Player;
    // user.players.push(newPlayer);
    return newPlayer
  }

  getPlayers(userid: number) {
      return this.playersRepository.find({where: { user: userid},  relations: ['user'] });
  }
  async getPlayerById(id: number) {
    const player = await this.playersRepository.findOne(id, { relations: ['user'] });
    if (player) {
      return player;
    }
    throw new HttpException(
        'Players with this id does not exist',
        HttpStatus.NOT_FOUND,
      )
  }

  async remove(
		id: number
	)
		: Promise<void>
	{
		await this.playersRepository.delete(id);
	}
}
