import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import  Room  from './entities/room.entity'
import { CreateRoomDto } from './dto/create-room.dto'
import User from '../users/entities/user.entity'
import Player from '../players/entities/player.entity'
import { UsersService } from '../users/users.service'
import { PlayersService } from '../players/players.service'
import * as bcrypt from 'bcrypt'
import { flatMap } from 'rxjs/operators'

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    private readonly playersService: PlayersService,
  ) {}

  async createRoom(roomData: CreateRoomDto, user: User) {
      const rooms = await this.roomsRepository.find({ relations: ["players"] });
      console.log(rooms);
      for (const room of rooms) {
        console.log("ROOM ROOM ROOM \n");
        console.log(room.players[0].user);
        if (room.players.length == 1) {
            console.log("IS EGUAL TO ONE");
            if (room.players[0].position == 'left') {
                console.log("PLAYER ON LEFT");
                const secondPlayer = await this.creatRightPlayer(this.playersService, user);
                console.log("NEW PLAYER ON LEFT");
                console.log(secondPlayer);
                room.players.push(secondPlayer)
            }
            else {
                console.log("PLAYER ON RIGHT");
                const secondPlayer = await this.creatRightPlayer(this.playersService, user);
                console.log("NEW PLAYER ON RIGHT");
                console.log(secondPlayer);
                room.players.push(secondPlayer)
            }
            console.log("RETURN ROOOOOM");
            // console.log(room.players[0].user);
            // console.log(room.players[1].user);
            await this.roomsRepository.save(room)
            return room;
        }
    };
    console.log("NEW PLAYER");
    const newPlayer = await this.playersService.createPlayer({position: 'left', score: 0, winner: false, is_ready: false}, user);
    console.log(newPlayer);
    console.log("NEW ROOM");
    const newRoom = await this.roomsRepository.create({...roomData, players: []})
    console.log("NEW ROOM");
    console.log(newRoom);
    newRoom.status = 'waiting';
    newRoom.game_mode = 'casual';
    newRoom.name = 'game_room_' + user.id;
    newRoom.players.push(newPlayer);
    console.log(newRoom);
    await this.roomsRepository.save(newRoom)
    console.log("----------------------------------");
    console.log(newRoom.players[0].user);
    console.log("----------------------------------");
    return newRoom
  }

  getRooms(playerid: number) {
      return this.roomsRepository.find({where: { player: playerid},  relations: ['player'] });
  }
  async getRoomById(id: number) {
    const room = await this.roomsRepository.findOne(id, { relations: ['player'] });
    if (room) {
      return room;
    }
    throw new HttpException(
        'Rooms with this id does not exist',
        HttpStatus.NOT_FOUND,
      )
  }

  async creatRightPlayer(playersService: PlayersService, user: User): Promise<Player> {
    const player = await playersService.createPlayer({position: 'right', score: 0, winner: false, is_ready: false}, user).then(function(result) {
        console.log("RESULT RESULT RESULT");
        console.log(result);
        return result; 
    });
    return player; 
  };

  async creatLeftPlayer(playersService: PlayersService, user: User): Promise<Player> {
    const player = await playersService.createPlayer({position: 'right', score: 0, winner: false, is_ready: false}, user).then(function(result) {
        console.log("RESULT RESULT RESULT");
        console.log(result);
        return result; 
    });
    return player; 
  };

//   async getRoomsByStatus(player: Player) {
//     let room = await this.roomsRepository.find({where: { player: player},  relations: ['player'] });
//     if (!room) {
//         room = await this.roomsRepository.findOne({status: "waiting"});
//     }
//     console.log("qsdqdqlkdqkhqkhqq");
//     if (room) {
//       return room;
//     }
//     else {
//         room = await this.roomsRepository.create({status: "waiting", game_mode: "casual", players: player})
//         await this.roomsRepository.save(room)
//         return room
//     }
    // throw new HttpException(
    //     // 'Rooms with this Status does not exist',
    //     // HttpStatus.NOT_FOUND,

    //   )
//   }
}
