import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SubscribeMessage, MessageBody }     from "@nestjs/websockets";
import { ConnectedSocket }                   from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';

import { RoomsService }   from '../rooms/services/rooms.service';
import { PlayersService } from '../players/services/players.service';
import { Player }         from '../players/entities/player.entity';
import { Room }           from '../rooms/entities/room.entity';
import UpdateRoomDto      from '../rooms/dto/update-room.dto';
import { UsersService } from 'src/users/services/users.service';
import { GameState, DifficultyLevel, MapType, Direction, GameMode } from '../enum/enum';
import { SocketRoomInfo, UpdateRoomType, Move } from '../type/type';
import { IGameInfoState, IBonusState, Game, IPlayerState, IMapPaddleState, IGameState, IBallState } from '../interface/interface';
import { Ball } from './ball';
import { Bonus } from './bonus';
import { Paddle } from './paddle';
import { GamePlayer } from './game_player';


export const WIDTH = 400
export const HEIGHT = 600

// export interface IGameState {
//   status: string
//   readonly difficulty: string
//   readonly mode: GameMode
//   readonly addons: boolean
//   begin: boolean
//   map: string
//   count: number
//   constructor (
//     status: string,
//     difficulty: string,
//     mode: GameMode,
//     addons: boolean,
//     begin: boolean,
//     map: string,
//     count: number,
//   ) {
//     this.status = status;
//     this.difficulty = difficulty;
//     this.mode = mode;
//     this.addons = addons;
//     this.begin = begin;
//     this.map = map;
//     this.count = count;
//   }
// }


@UseInterceptors(ClassSerializerInterceptor)
@WebSocketGateway({
	namespace: 'game-rooms',
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"]
	}
})
export class GameRoomsGateway
{

	@WebSocketServer()
  server: Server;
  
  game: {[index: string] : IGameInfoState} = {};

  constructor(
    private roomsService: RoomsService,
    private playerService: PlayersService,
    private userService: UsersService

  ) { }

  @SubscribeMessage('joinRoom')
  async handleRoomJoin(
    // @MessageBody() room: string,
    @MessageBody() roomId: number,
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
  // ): string {

    const roomName = `room-${roomId}`
    const room = await this.roomsService.findOne(roomId)
    // console.log(room)


    client.join(roomName);
    // client.join(room);


    // emit to all clients in room except the sender
    client.to(roomName).emit('roomJoined', room);
    // client.to(room).emit('roomJoined', room);
    // return 'Joined ' + room;
    return 'Joined ' + roomName;
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SocketRoomInfo
  ): Promise<string> {

    const roomId = await this.playerService.findRoomNumber(data.playerId)
    // delete player from db
    await this.playerService.remove(data.playerId)
    // remove socket from room
    client.leave(data.room);

    // Update game room for opponent
    const room = await this.roomsService.findOne(roomId)
  
    // TODO: update game room state depending of the situation
  

    this.server.to(data.room).emit('updateRoomInClient', 
      {room: room} )
  
    return 'Player ' + data.playerId + ' deleted';
  }

  @SubscribeMessage('giveUpRoom')
  async giveUpRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SocketRoomInfo
  ): Promise<string> {

    const roomId = await this.playerService.findRoomNumber(data.playerId)

    // remove socket from room
    client.leave(data.room);

    // Update game room for opponent
    let room = await this.roomsService.findOne(roomId)
  
    // TODO: update game room state depending of the situation
    let playerL: Player = null;
    let playerR: Player = null;
    if ( room.players[0].id == data.playerId) {
      playerL = await this.playerService.update( room.players[0].id ,{ winner: false })
      playerR = await this.playerService.update( room.players[1].id, { winner: true })
      this.game[data.room].player_left.winner = false;
      this.game[data.room].player_right.winner = true;
    }
    else {
      playerL =  await this.playerService.update( room.players[0].id ,{ winner: true })
      playerR =  await this.playerService.update( room.players[1].id, { winner: false })
      this.game[data.room].player_left.winner = true;
      this.game[data.room].player_right.winner = false;
    }
    this.server.to(data.room).emit('updateRoomInClient', 
    {room: playerL.room} )
    this.server.to(data.room).emit('updateRoomInClient', 
    {room: playerR.room} )
    this.game[data.room].info.status = GameState.OVER
    room = await this.roomsService.update(roomId, {state: GameState.OVER})
    this.server.to(data.room).emit('updateRoomInClient',
      {room: room} )
    
  
    return 'Player ' + data.playerId + ' give up';
  }

  @SubscribeMessage('goBackRoom')
  async goBackRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SocketRoomInfo
  ): Promise<string> {

    // const roomId = await this.playerService.findRoomNumber(data.playerId)
    console.log("----------GO BACK-----------------")
    // remove socket from room
    client.leave(data.room);

    const roomId = await this.playerService.findRoomNumber(data.playerId)

    let room = await this.roomsService.findOne(roomId)

    // Update game room for opponent
    // const room = await this.roomsService.findOne(roomId)
  
    // TODO: update game room state depending of the situation
  

    this.server.to(data.room).emit('updateRoomInClient', 
      {room: room} )
  
    return 'Player ' + data.playerId + ' go back';
  }

  @SubscribeMessage('leaveStream')
  async leaveStream(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SocketRoomInfo
  ): Promise<string> {

    // const roomId = await this.playerService.findRoomNumber(data.playerId)
    console.log("----------GO BACK-----------------")
    // remove socket from room
    client.leave(data.room);
    return 'Watcher Leave Stream';
  }


  @SubscribeMessage('getReady')
  async getReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SocketRoomInfo
  ): Promise<void> {

      const player: Player = await this.playerService.update(data.playerId, { isReady: true })

      this.server.to(data.room).emit('updateRoomInClient', 
        {room: player.room} )

      client.to(data.room).emit('checkReady',
        {room: player.room} );
  }

  @SubscribeMessage('updateRoomInServer')
  async updateRoom(
    @MessageBody() data: UpdateRoomType
  ): Promise<void> {

      const room: Room = await this.roomsService.update(data.roomId, data.dto)
      const rooms: Room[] = await this.roomsService.findAllByMode(room.mode)
      this.server.emit('updateWatchRoomInClient', {rooms: rooms})
      this.server.to(data.socketRoomName).emit('updateRoomInClient', 
        {room: room} )
  }




  @SubscribeMessage('init')
	handleInit(
		@MessageBody() data: object
	)
		: void
	{
      let player_left: GamePlayer = null;
      let player_right: GamePlayer = null;
      let bonus: Bonus = null;
      let paddle_left: Paddle = null;
      let paddle_right: Paddle = null;
      let ball: Ball = null;
      let map_paddle = new Array<Paddle>();

      let info = new State(GameState.PLAYING, data['room'].option.difficulty, data['room'].mode, data['room'].option.powerUps, true, data['room'].option.map, 3);

      if ( info.map != MapType.DEFAULT ) {
        if ( info.map == MapType.MAP1 ) {
          map_paddle = [];
          let map1_paddle1 = new Paddle(HEIGHT/2, 0, 2.5, Direction.NOT, 0);
          let map1_paddle2 = new Paddle(HEIGHT/2,  WIDTH - 160, 2.5, Direction.NOT, 0);
          map_paddle.push(map1_paddle1, map1_paddle2);
        }
        else if ( info.map == MapType.MAP2 ) {
          map_paddle = [];
          let map2_paddle1 = new Paddle(HEIGHT/10 + 100, WIDTH/2 - 40, 5, Direction.UP, 5);
          let map2_paddle2 = new Paddle(HEIGHT/1.1 - 100,  WIDTH/2 - 40, 5, Direction.DOWN, 5);
          map_paddle.push(map2_paddle1, map2_paddle2);
        }
      }
      if ( info.addons ) {
        bonus = new Bonus(Math.random() * (WIDTH - 200) + 200, Math.random() * (200 - 100) + 100, 8, 0, true, Date.now());
      }
      else {
        bonus = new Bonus(0, 0, 0, 0, false, 0);
      }

      switch ( info.difficulty ) {

        case DifficultyLevel.EASY:
          ball = new Ball(5, 3, 3);
          paddle_left = new Paddle(HEIGHT/10, WIDTH/2 - 40, 5, Direction.NOT, 7);
          paddle_right = new Paddle(HEIGHT/1.1, WIDTH/2 - 40, 5, Direction.NOT, 7);
          break;
        case DifficultyLevel.MEDIUM:
          ball = new Ball(9, 6, 6);
          paddle_left = new Paddle(HEIGHT/10, WIDTH/2 - 40, 5, Direction.NOT, 8);
          paddle_right = new Paddle(HEIGHT/1.1, WIDTH/2 - 40, 5, Direction.NOT, 8);
          break;
        case DifficultyLevel.HARD:
          ball = new Ball(11, 7, 7);
          paddle_left = new Paddle(HEIGHT/10, WIDTH/2 - 40, 5, Direction.NOT, 9);
          paddle_right = new Paddle(HEIGHT/1.1, WIDTH/2 - 40, 5, Direction.NOT, 9);
          break;
      }
      data['players'].forEach(player => {
        
        if ( player.position == 'left' ) {
          this.game[data["socketRoomName"]].player_left.id = player.id;
          this.game[data["socketRoomName"]].player_left.user_id = player.user.id;
          this.game[data["socketRoomName"]].player_left.score = 0;
          this.game[data["socketRoomName"]].player_left.winner = null;
          this.game[data["socketRoomName"]].player_left.is_ready = true;
        }
        else {
          this.game[data["socketRoomName"]].player_right.id = player.id;
          this.game[data["socketRoomName"]].player_right.user_id = player.user.id;
          this.game[data["socketRoomName"]].player_right.score = 0;
          this.game[data["socketRoomName"]].player_right.winner = null;
          this.game[data["socketRoomName"]].player_right.is_ready = true;
        }


      });
      this.game[data["socketRoomName"]].info.map = data['room'].option.map;
      this.game[data["socketRoomName"]].info.difficulty = data['room'].option.difficulty;
      this.game[data["socketRoomName"]].info.mode = data['room'].mode;
      this.game[data["socketRoomName"]].info.addons = data['room'].option.powerUps;
      if ( this.game[data["socketRoomName"]].info.map != Maps.Def ) {
        if ( this.game[data["socketRoomName"]].info.map == Maps.Mape1 ) {
          this.game[data["socketRoomName"]].map_paddle = [];
          this.game[data["socketRoomName"]].map_paddle.push({x: 600/2, y: 0, height: 2.5, move: "not", speed: 0}, {x: 600/2, y: 400 - 160, height: 2.5, move: "not", speed: 0});
        }
        else if ( this.game[data["socketRoomName"]].info.map == Maps.Mape2 ) {
          this.game[data["socketRoomName"]].map_paddle = [];
          this.game[data["socketRoomName"]].map_paddle.push({x: 600/10 + 100, y: 400/2 - 40, height: 5, move: Direction.Up, speed: 5}, {x: 600/1.1 - 100, y: 400/2 - 40, height: 5, move: Direction.Down, speed: 5});
        }
      }
      if ( this.game[data["socketRoomName"]].info.addons ) {
          this.game[data["socketRoomName"]].addon_ball = {x:  Math.random() * (400 - 200) + 200 , y: Math.random() * (200 - 100) + 100, rayon: 5, speed: 7, xspeed: 3 * ([1,-1][Math.round(Math.random())]), yspeed: 3 * ([1,-1][Math.round(Math.random())]), last_touch_id: 0, exist: true, time: Date.now(), is_addon: true};
      }
 
      switch (this.game[data["socketRoomName"]].info.difficulty) {
        case Difficulty.Easy:
          this.game[data["socketRoomName"]].ball.speed = 5;
          this.game[data["socketRoomName"]].ball.xspeed = 3;
          this.game[data["socketRoomName"]].ball.yspeed = 3;
          this.game[data["socketRoomName"]].player_left.paddle.speed = 7;
          this.game[data["socketRoomName"]].player_right.paddle.speed = 7;
          break;
        case Difficulty.Medium:
          this.game[data["socketRoomName"]].ball.speed = 9;

          this.game[data["socketRoomName"]].ball.xspeed = 6;
          this.game[data["socketRoomName"]].ball.yspeed = 6;
          this.game[data["socketRoomName"]].player_left.paddle.speed = 8;
          this.game[data["socketRoomName"]].player_right.paddle.speed = 8;
          break;
        case Difficulty.Hard:
          this.game[data["socketRoomName"]].ball.speed = 11;

          this.game[data["socketRoomName"]].ball.xspeed = 7;
          this.game[data["socketRoomName"]].ball.yspeed = 7;
          this.game[data["socketRoomName"]].player_left.paddle.speed = 9;
          this.game[data["socketRoomName"]].player_right.paddle.speed = 9;
          break;
      }

      start(this.game[data["socketRoomName"]], data["socketRoomName"], this.server, this.playerService, this.roomsService, this.userService);

      async function start(game: IGameInfoState, room: string, server: Server, playerService: PlayersService, roomsService: RoomsService, userService: UsersService): Promise<void> {
        let player_left = game.player_left;
        let player_right = game.player_right;
        let ball = game.ball;
        let map_paddle = game.map_paddle;
        const info = game.info;

        let addon_ball = game.addon_ball;

        if (info.count >= 0) {
          server.to(room).emit('begin', {player_left: player_left, player_right: player_right, ball: ball, info: info, map_paddle: map_paddle, addon_ball: addon_ball});
          setTimeout(function() {start(game, room, server, playerService, roomsService, userService)}, 1000)
          game.info.count -= 1
        }
        else {
          game_loop(game, room, server, playerService, roomsService, userService)
        }
      }
      
      async function game_loop(game: IGameInfoState, room: string, server: Server, playerService: PlayersService, roomsService: RoomsService, userService: UsersService): Promise<void> {
        let player_left = game.player_left;
        let player_right = game.player_right;
        let ball = game.ball;
        let map_paddle = game.map_paddle;
        const info = game.info;
        var myVar = null;

        let addon_ball = game.addon_ball;

        player_move(player_left.paddle, ball);
        player_move(player_right.paddle, ball);

        for (var paddle of map_paddle) {
            player_move(paddle, ball);
            if ( paddle.y == 0 ) {
                paddle.move = Direction.Down;
            }
            else if ( paddle.y == 400 - 80 ) {
                paddle.move = Direction.Up;
            }
        }

        const topY = ball.y + ball.rayon;
        const botY = ball.y - ball.rayon;
        
        if ( botY <= 0 || topY >= 400) {
            ball.yspeed *= -1;
        }
        if ( ball.x + ball.rayon <= 0 || ball.x - ball.rayon >= 600 ) {
          if ( ball.x <= 0 ) {
              player_right.score += 1;
          }
          else {
              player_left.score += 1;
          }
          init_match(player_left, player_right, ball, map_paddle, info, room, server, playerService);
        }
        
        ball.x += ball.xspeed;
        ball.y += ball.yspeed;

        // const topY = ball.y + ball.rayon;
        // const botY = ball.y - ball.rayon;
        
        // if ( botY < 0 ) {
        //     ball.y = ball.rayon;
        //     ball.yspeed *= -1;
        // }
        // else if ( topY > 400 ) {
        //     ball.y = 400 - ball.rayon;
        //     ball.yspeed *= -1;
        // }
        player_ball_collision(ball, player_left.paddle, info.map, player_left.id);
        player_ball_collision(ball, player_right.paddle, info.map, player_right.id);

        for (var paddle of map_paddle) {
            player_ball_collision(ball, paddle, info.map, 0);
        }

        if ( info.addons )
        {
          if (!bonus.exist && (Date.now() - bonus.time) >= 3000) {
            bonus.startBonus();
          }
        }

        if ( addon_ball.exist ) {
            // addon_ball.x += addon_ball.xspeed;
            // addon_ball.y += addon_ball.yspeed;

            var rSum = ball.rayon + addon_ball.rayon;
            var dx = ball.x - addon_ball.x;
            var dy = ball.y - addon_ball.y;

            if (Math.pow((rSum), 2) > (Math.pow(dx, 2) + Math.pow(dy, 2))) {
                addon_ball.last_touch_id = ball.last_touch_id;
                console.log(addon_ball.last_touch_id);
                bounce(ball);
                if ( addon_ball.last_touch_id == 0 ) {
                    bounce(ball);
                    // bounce(addon_ball);
                }
            }
            else {
                const topY = addon_ball.y + addon_ball.rayon;
                const botY = addon_ball.y - addon_ball.rayon;
                
                if ( botY < 0 ) {
                    addon_ball.y = addon_ball.rayon;
                    addon_ball.yspeed *= -1;
                }
                else if ( topY > 400 ) {
                    addon_ball.y = 400 - addon_ball.rayon;
                    addon_ball.yspeed *= -1;
                }

                player_ball_collision(addon_ball, player_left.paddle, info.map, player_left.id);
                player_ball_collision(addon_ball, player_right.paddle, info.map, player_right.id);

                for (var paddle of map_paddle) {
                    player_ball_collision(addon_ball, paddle, info.map, 0);
                }
            }
        }

        if (addon_ball.exist) {

            if ( player_left.id == addon_ball.last_touch_id ) {
                player_left.paddle.height = 3.2;
                player_left.addons_date = Date.now();
                addon_ball.exist = false;
            }
            else if ( player_right.id == addon_ball.last_touch_id ) {
                player_right.paddle.height = 3.2;
                player_right.addons_date = Date.now();
                addon_ball.exist = false;
            }
            if ( addon_ball.x + addon_ball.rayon <= 0 || addon_ball.x - addon_ball.rayon >= 600 ) {
                addon_ball.exist = false;
            }
        }

        if ( (Date.now() - player_left.addons_date) >= 10000) {
            player_left.paddle.height = 5;
        }
        if ( (Date.now() - player_right.addons_date) >= 10000) {
            player_right.paddle.height = 5;
        }

        // if ( ball.x + ball.rayon <= 0 || ball.x - ball.rayon >= 600 ) {
        //     if ( ball.x <= 0 ) {
        //         player_right.score += 1;
        //     }
        //     else {
        //         player_left.score += 1;
        //     }
        //     init_match(player_left, player_right, ball, map_paddle, info, room, server, playerService);
        // }

        // server.to(room).emit('begin', {player_left: player_left, player_right: player_right, ball: ball, info: info, map_paddle: map_paddle, addon_ball: addon_ball});
        game.player_left = player_left;
        game.player_right = player_right;
        game.ball = ball;
        game.info = info;
        game.map_paddle = map_paddle;
        game.bonus = bonus;

        const maxScore = 15
        if (game.player_right.getScore() != maxScore && game.player_left.getScore() != maxScore && (game.info.status == GameState.PLAYING)){
          server.to(room).emit('begin', {player_left: player_left, player_right: player_right, ball: ball, info: info, map_paddle: map_paddle, bonus: bonus});
          myVar = setTimeout(function() {game_loop(game, room, server, playerService, roomsService, userService)}, 1000/60)
        }
        else {
          clearTimeout(myVar);
          if (game.info.status == GameState.PLAYING && game.player_left.getScore() == maxScore) {
            game.player_left.setWinner(true);
            game.player_right.setWinner(false);
          }
          else if (game.info.status == GameState.PLAYING && game.player_right.getScore() == maxScore ) {
            game.player_right.setWinner(true);
            game.player_left.setWinner(false);

          }
          end_game(game, room, server, playerService, roomsService, userService)
          server.to(room).emit('begin', {player_left: player_left, player_right: player_right, ball: ball, info: info, map_paddle: map_paddle, addon_ball: addon_ball});
        }
    }

    function player_move( paddle: IMapPaddleState, ball: IBallState) : void {
        const topX = ball.x + ball.rayon;
        const topY = ball.y + ball.rayon;
        const botX = ball.x - ball.rayon;
        const botY = ball.y - ball.rayon;
        if ( paddle.move == Direction.Up ) {
            const upy = paddle.y - paddle.speed;
            if (topX > paddle.x && botX < paddle.x + 600/80 && topY + ball.yspeed > upy && botY + ball.yspeed < upy +  (400 / paddle.height))
            {
              paddle.y = topY + ball.yspeed;
            }
            paddle.y = (upy <= 0) ? 0 : upy;
        }
        else if (paddle.move == Direction.Down ) {
            const downy = paddle.y + paddle.speed;
            if ( topX > paddle.x && botX < paddle.x + 600/80 && topY + ball.yspeed > downy && botY + ball.yspeed < downy +  (400 / paddle.height)) {
              paddle.y = topY + ball.yspeed;
            }
            paddle.y = (downy + (400 / paddle.height)) >= 400 ? 400 - (400 / paddle.height) : downy;
        }
    }

    function player_ball_collision(ball: IBallState, paddle: IMapPaddleState, map: string, id: number) : void {
        const topX = ball.x + ball.rayon;
        const topY = ball.y + ball.rayon;
        const botX = ball.x - ball.rayon;
        const botY = ball.y - ball.rayon;

        const paddelTop = paddle.y;
        const paddleRight = paddle.x + 600/80;
        const paddleBot = paddle.y + (400 / paddle.height);
        const paddleLeft = paddle.x;
        let angle = 0;

        if (botX < paddleRight && botY < paddleBot && topX > paddleLeft && topY > paddelTop)
        {
          let collidePoint = ball.y - (paddle.y + ((400 / paddle.height)/2));

          collidePoint = collidePoint / ((400 / paddle.height) / 2);

        let direction = ball.x < HEIGHT/2 ? 1 : -1;
        ball.last_touch_id = id;
        if (id == 0) {
          if (map == MapType.MAP1) {
            ball.xspeed *= direction 
            ball.yspeed = ball.speed * Math.sin(angle);
          }
          else {
            if (ball.x <= paddle.x) {
              ball.xspeed = -1 * ball.speed * Math.cos(angle);
              ball.yspeed = ball.speed * Math.sin(angle);
            }
            else {
              ball.xspeed = ball.speed * Math.cos(angle);
              ball.yspeed = ball.speed * Math.sin(angle);
            }
          }
        }
        else {
          ball.xspeed = direction * ball.speed * Math.cos(angle);
          ball.yspeed = ball.speed * Math.sin(angle);
        }
        // if ( topX + ball.xspeed > paddle.x && botX + ball.xspeed < paddle.x + 600/80 && topY > paddle.y && botY < paddle.y + (400 / paddle.height)) {
        //   ball.last_touch_id = id;
        //   ball.xspeed *= -1;
        //   ball.xspeed += 0.4;
        //   ball.x += ball.xspeed
        //   // const offset = (topY - paddle.y) / ((400/paddle.height) + ball.rayon)
        //   // const phi = 0.25 * Math.PI * (2 * offset - 1)
        //   // ball.xspeed *= -1;
        //   // ball.yspeed = ball.yspeed * Math.sin(phi);
        // }
        // if ( topX > paddle.x && botX < paddle.x + 600/80 && topY + ball.yspeed > paddle.y && botY + ball.yspeed < paddle.y +  (400 / paddle.height)) {
        //   ball.last_touch_id = id;
        //   ball.yspeed *= -1;
        //   ball.yspeed += 0.6;
        //   ball.y += ball.yspeed;
        // }

    }

    function start_addons(player_left: IPlayerState, player_right: IPlayerState, ball: IBallState, map_paddle: IMapPaddleState[], info: IGameState, addon_ball: IBallState) : void {
        if ( !addon_ball.exist ) {
            addon_ball.x = Math.random() * (400 - 200) + 200;
            addon_ball.y = Math.random() * (200 - 100) + 100;
            addon_ball.rayon = 5;
            addon_ball.xspeed = 3 * ([1,-1][Math.round(Math.random())]);
            addon_ball.yspeed = 3 * ([1,-1][Math.round(Math.random())]);
            addon_ball.last_touch_id = 0;
            addon_ball.exist = true;
            addon_ball.time = Date.now();
        }
        info.begin = false;
    }

    async function init_match(player_left: IPlayerState, player_right: IPlayerState, ball: IBallState, map_paddle: IMapPaddleState[], info: IGameState, room: string, server: Server, playerService: PlayersService): Promise<void> {
        player_left.paddle.y = 400/2 - 40;
        player_left.paddle.move = "not";

        player_right.paddle.y = 400/2 - 40;
        player_right.paddle.move = "not";

        ball.x = 600/2;
        ball.y = 400/2;
        switch (info.difficulty) {
          case Difficulty.Easy:
            ball.speed = 5;
            ball.xspeed = 3;
            ball.yspeed = 3;
            break;
          case Difficulty.Medium:
            ball.speed = 9;
            ball.xspeed = 6;
            ball.yspeed = 6;
            break;
          case Difficulty.Hard:
            ball.speed = 11;
            ball.xspeed = 7;
            ball.yspeed = 7;
            break;
        }

        ball.xspeed *= [1,-1][Math.round(Math.random())];
        ball.yspeed *= [1,-1][Math.round(Math.random())];
        if ( info.map != Maps.Def ) {
            map_paddle = [];
            if ( info.map == Maps.Mape1 ) {
                map_paddle.push({x: 600/2, y: 0, height: 2.5, move: "not", speed: 0}, {x: 600/2, y: 400 - 160, height: 2.5, move: "not", speed: 0});
            }
            else if ( info.map == Maps.Mape2 ) {
                map_paddle.push({x: 600/10 + 100, y: 400/2 - 40, height: 5, move: Direction.Up, speed: 5}, {x: 600/1.1 - 100, y: 400/2 - 40, height: 5, move: Direction.Down, speed: 5});
            }
        }
        const playerL: Player = await playerService.update(player_left.id, { score: player_left.score })
        const playerR: Player = await playerService.update(player_right.id, { score: player_right.score })
 
        server.to(room).emit('updateRoomInClient', 
        {room: playerL.room} )
        server.to(room).emit('updateRoomInClient', 
        {room: playerR.room} )
    }

    function bounce(ball: IBallState): void {
        ball.yspeed *= 1;
        ball.xspeed *= -1;
        ball.yspeed += 0.6;
        ball.xspeed += 0.4;
        ball.x += ball.xspeed;
        ball.y += ball.yspeed;
    }

    async function end_game(game: IGameInfoState, roomName: string, server: Server, playerService: PlayersService, roomsService: RoomsService, userService: UsersService): Promise<void>  {
      
      console.log("END " + game.player_left.winner + game.player_right.winner );
      const roomId = await playerService.findRoomNumber(game.player_left.id)
      const playerL: Player = await playerService.update(game.player_left.id, { winner: game.player_left.winner })
      const playerR: Player = await playerService.update(game.player_right.id, { winner: game.player_right.winner })
      game.info.status = GameState.OVER;
      server.to(roomName).emit('updateRoomInClient', 
      {room: playerL.room} )
      server.to(roomName).emit('updateRoomInClient', 
      {room: playerR.room} )
      const room: Room = await roomsService.update(roomId, {state: GameState.OVER})
      server.to(roomName).emit('updateRoomInClient',
        {room: room} )
      if (game.info.mode == "ladder") {
        const ladder_left: number =  await userService.findOneLadderLevel(game.player_left.user_id)
        const ladder_right: number =  await userService.findOneLadderLevel(game.player_right.user_id)
        console.log("----------LADDER LEFT-----------")
        console.log(ladder_left)

        console.log("----------LADDER RIGHT-----------")
        console.log(ladder_right)
        console.log(game.player_right.getWinner());
        
        if (game.player_left.getWinner() && ladder_left >= ladder_right
          || game.player_right.getWinner() && ladder_right >= ladder_left) {
            let newlader_left = ladder_left;
            let newlader_right = ladder_right;
            if (game.player_left.getWinner()) {
              const dif = ladder_left - ladder_right;
              newlader_left += (3 - dif > 1) ? 3 - dif : 1;
              newlader_right -= ((3 - dif)/2 > 1) ? Math.round((3 - (dif))/2) : 1;
            }
            else {
              const dif = ladder_right - ladder_left;
              newlader_right += (3 - dif > 1) ? 3 - dif : 1;
              newlader_left -= ((3 - dif)/2 > 1) ? Math.round((3 - dif)/2) : 1;
            }
            await userService.updateLadderLevel(game.player_left.getUserId(), newlader_left)
            await userService.updateLadderLevel(game.player_right.getUserId(), newlader_right)
        }
        else if (game.player_left.getWinner() && ladder_left < ladder_right
          || game.player_right.getWinner() && ladder_right < ladder_left) {

            let newlader_left = ladder_left;
            let newlader_right = ladder_right;
            if (game.player_left.getWinner()) {
              const dif = ladder_right - ladder_left;
              newlader_left += ((dif) - ((dif) * 40 / 100) > 1) ? Math.round((dif) - ((dif) * 40 / 100)) : 3 - dif;
              newlader_right -= ((dif) - ((dif) * 70 / 100) > 1) ? Math.round((dif) - ((dif) * 70 / 100)) : 3 - dif;
            }
            else {
              const dif = ladder_left - ladder_right;
              newlader_right += ((dif) - ((dif) * 40 / 100) > 1) ? Math.round((dif) - ((dif) * 40 / 100)) : 3 - dif;
              newlader_left -= ((dif) - ((dif) * 70 / 100) > 1) ? Math.round((dif) - ((dif) * 70 / 100)) : 3 - dif;
            }
            await userService.updateLadderLevel(game.player_left.getUserId(), newlader_left)
            await userService.updateLadderLevel(game.player_right.getUserId(), newlader_right)
        }
        
        // if (game.player_left.getWinner() && ladder_left > ladder_right
        //   || game.player_right.getWinner() && ladder_right > ladder_left) {
        //   console.log("----------UPDATING LADDER LEVELS-----------")
        //   await userService.updateLadderLevel(game.player_left.getUserId(), ladder_right)
        //   await userService.updateLadderLevel(game.player_right.getUserId(), ladder_left)
        // }
      }
      const rooms: Room[] = await roomsService.findAllByMode(game.info.mode)
      server.emit('updateWatchRoomInClient', {rooms: rooms})
    }
  }


  @SubscribeMessage('move')
	handleMove(
		@MessageBody() event: Move
	)
		: void
	{
        console.log(event);
        if ( this.game[event.room].player_left.user_id == event.user_id ) {
            this.game[event.room].player_left.paddle.move = event.move;
        }
        else if ( this.game[event.room].player_right.user_id == event.user_id ) {
            this.game[event.room].player_right.paddle.move = event.move;
        }
		// this.server.emit('message', data);
    }

  // TODO: if game end: disconnect all client sockets from game room
}