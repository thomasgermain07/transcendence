import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SubscribeMessage, MessageBody }     from "@nestjs/websockets";
import { ConnectedSocket }                   from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { UseInterceptors, ClassSerializerInterceptor, UseGuards } from '@nestjs/common';

import { RoomsService }   from '../rooms/services/rooms.service';
import { PlayersService } from '../players/services/players.service';
import { Player }         from '../players/entities/player.entity';
import { Room }           from '../rooms/entities/room.entity';
import { UsersService } from 'src/users/services/users.service';
import { GameState, DifficultyLevel, MapType, Direction, GameMode } from '../enum/enum';
import { SocketRoomInfo, UpdateRoomType, Move } from '../type/type';
import { IGameInfoState, IBonusState, IGameState, Game } from '../interface/interface';
import { Ball } from './ball';
import { Bonus } from './bonus'
import { Paddle } from './paddle';
import { GamePlayer } from './game_player';
import { WsJwtGuard } from '../../auth/guards/ws-jwt.guard';


export const WIDTH = 400
export const HEIGHT = 600

export class State implements IGameState {
  status: string
  readonly difficulty: string
  readonly mode: GameMode
  readonly addons: boolean
  begin: boolean
  readonly map: string
  count: number
  constructor (
    status: string,
    difficulty: string,
    mode: GameMode,
    addons: boolean,
    begin: boolean,
    map: string,
    count: number,
  ) {
    this.status = status;
    this.difficulty = difficulty;
    this.mode = mode;
    this.addons = addons;
    this.begin = begin;
    this.map = map;
    this.count = count;
  }
}

@UseGuards(WsJwtGuard)
@UseInterceptors(ClassSerializerInterceptor)
@WebSocketGateway({
	namespace: 'game-rooms',
})
export class GameRoomsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{

	@WebSocketServer()
  server: Server;

  game: {[index: string] : Game} = {};

  constructor(
    private roomsService: RoomsService,
    private playerService: PlayersService,
    private userService: UsersService

  ) { }

	// -------------------------------------------------------------------------
	// Interfaces implementations
	// -------------------------------------------------------------------------
	afterInit(server: Server): void {
		console.log(`GameRoom:Gateway: Initialized.`)
	}


	handleConnection(client: Socket, ...args: any[]): void {
		console.log(`GameRoom:Gateway: Connection.`)
    console.log(client.id)
	}

	handleDisconnect(client: Socket): void {
		console.log(`GameRoom:Gateway: Disconnect.`)
	}

  @SubscribeMessage('joinRoom')
  async handleRoomJoin(
    @MessageBody() roomId: number,
    @ConnectedSocket() client: Socket,
  ): Promise<string> {

    const roomName = `room-${roomId}`
    const room = await this.roomsService.findOne(roomId)

    client.join(roomName);

    // emit to all clients in room except the sender
    client.to(roomName).emit('roomJoined', room);

    return 'Joined ' + roomName;
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SocketRoomInfo
  ): Promise<string> {

    // delete player from db
    await this.playerService.remove(data.playerId)
    // remove socket from room
    client.leave(data.room);
    // notify other player that someone left the room
    this.server.to(data.room).emit('opponentLeaving')

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
    console.log(room.players[0].id);
    console.log(data.playerId);
    if ( room.players[0].id == data.playerId) {
      playerL = await this.playerService.update( room.players[0].id ,{ winner: false })
      playerR = await this.playerService.update( room.players[1].id, { winner: true })
      if (this.game[data.room].player_left.getId() == data.playerId ) {
        this.game[data.room].player_left.setWinner(false);
        this.game[data.room].player_right.setWinner(true);
      }
      else {
        this.game[data.room].player_right.setWinner(false);
        this.game[data.room].player_left.setWinner(true);
      }
    }
    else {
      playerL =  await this.playerService.update( room.players[0].id ,{ winner: true })
      playerR =  await this.playerService.update( room.players[1].id, { winner: false })
      if (this.game[data.room].player_left.getId() == data.playerId ) {
        this.game[data.room].player_left.setWinner(false);
        this.game[data.room].player_right.setWinner(true);
      }
      else {
        this.game[data.room].player_right.setWinner(false);
        this.game[data.room].player_left.setWinner(true);
      }
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

    // remove socket from room
    client.leave(data.room);

    const roomId = await this.playerService.findRoomNumber(data.playerId)

    let room = await this.roomsService.findOne(roomId)

    this.server.to(data.room).emit('updateRoomInClient',
      {room: room} )

    return 'Player ' + data.playerId + ' go back';
  }

  @SubscribeMessage('leaveStream')
  async leaveStream(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SocketRoomInfo
  ): Promise<string> {

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

  @SubscribeMessage('notReady')
  async notReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SocketRoomInfo
  ): Promise<void> {

    try {
      await this.playerService.update(data.playerId, { isReady: false })
    } catch (error) {
      console.log('In not ready Exception - player not found')
    }
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
          player_left = new GamePlayer(player.id, player.user.id, 'left', 0, null, true, paddle_left, 0);
        }
        else {
          player_right = new GamePlayer(player.id, player.user.id, 'right', 0, null, true, paddle_right, 0);
        }

      });
      if (!this.game[data["socketRoomName"]]) {
        this.game[data["socketRoomName"]] = new Game(player_left, player_right, ball, info, map_paddle, bonus);
      }

      start(this.game[data["socketRoomName"]], data["socketRoomName"], this.server, this.playerService, this.roomsService, this.userService);

      async function start(game: Game, room: string, server: Server, playerService: PlayersService, roomsService: RoomsService, userService: UsersService): Promise<void> {
        let player_left = game.player_left;
        let player_right = game.player_right;
        let ball = game.ball;
        let map_paddle = game.map_paddle;
        const info = game.info;
        let bonus = game.bonus;

        if (info.count >= 0) {
          server.to(room).emit('begin', {player_left: player_left, player_right: player_right, ball: ball, info: info, map_paddle: map_paddle, bonus: bonus});
          setTimeout(function() {start(game, room, server, playerService, roomsService, userService)}, 1000)
          game.info.count -= 1
        }
        else {
          game_loop(game, room, server, playerService, roomsService, userService)
        }
      }

      async function game_loop(game: Game, room: string, server: Server, playerService: PlayersService, roomsService: RoomsService, userService: UsersService): Promise<void> {
        let player_left = game.player_left;
        let player_right = game.player_right;
        let ball = game.ball;
        let map_paddle = game.map_paddle;
        const info = game.info;
        var myVar = null;

        let bonus = game.bonus;

        player_left.paddle.paddle_move(ball);
        player_right.paddle.paddle_move(ball);

        for (var paddle of map_paddle) {
            paddle.paddle_move(ball);
            if ( paddle.y == 0 ) {
                paddle.move = Direction.DOWN;
            }
            else if ( paddle.y == WIDTH - 80 ) {
                paddle.move = Direction.UP;
            }
        }

        const topY = ball.y + ball.rayon;
        const botY = ball.y - ball.rayon;

        if ( botY <= 0 || topY >= WIDTH) {
            ball.yspeed *= -1;
        }

        ball.addSpeedBall()

        player_ball_collision(ball, player_left.paddle, info.map, player_left.getId());
        player_ball_collision(ball, player_right.paddle, info.map, player_right.getId());

        for (var paddle of map_paddle) {
            player_ball_collision(ball, paddle, info.map, 0);
        }

        if ( info.addons )
        {
          if (!bonus.exist && (Date.now() - bonus.time) >= 3000) {
            bonus.startBonus();
          }
        }
        if ( bonus.exist ) {
          bonus.ballBonusCollision(ball);
          active_bonus_on_player(player_left, player_right, bonus);
        }

        player_left.checkChangePaddleSize();
        player_right.checkChangePaddleSize();

        if ( ball.x + ball.rayon <= 0 || ball.x - ball.rayon >= HEIGHT ) {
          if ( ball.x <= 0 ) {
              player_right.addScore();
          }
          else {
              player_left.addScore();
          }
          init_match(player_left, player_right, ball, info, room, server, playerService);
        }
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
          server.to(room).emit('begin', {player_left: player_left, player_right: player_right, ball: ball, info: info, map_paddle: map_paddle, bonus: bonus});
        }
    }

    function player_ball_collision(ball: Ball, paddle: Paddle, map: string, id: number) : void {
      const topX = ball.x + ball.rayon;
      const topY = ball.y + ball.rayon;
      const botX = ball.x - ball.rayon;
      const botY = ball.y - ball.rayon;

      const paddleTop = paddle.y;
      const paddleRight = paddle.x + HEIGHT/80;
      const paddleBot = paddle.y + (WIDTH / paddle.height);
      const paddleLeft = paddle.x;
      let angle = 0;

      if (botX < paddleRight && botY < paddleBot && topX > paddleLeft && topY > paddleTop)
      {
        let collidePoint = ball.y - (paddle.y + ((WIDTH / paddle.height)/2));

        collidePoint = collidePoint / ((WIDTH / paddle.height) / 2);

        angle = collidePoint * Math.PI/4;

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
        ball.speed += 0.1;
      }
    }

    function active_bonus_on_player(player_left: GamePlayer, player_right: GamePlayer, bonus: IBonusState) {
      if ( player_left.getId() == bonus.last_touch_id ) {
        player_left.paddle.height = 3.2;
        player_left.addons_date = Date.now();
        bonus.exist = false;
      }
      else if ( player_right.getId() == bonus.last_touch_id ) {
        player_right.paddle.height = 3.2;
        player_right.addons_date = Date.now();
        bonus.exist = false;
      }
    }


    async function init_match(player_left: GamePlayer, player_right: GamePlayer, ball: Ball, info: IGameState, room: string, server: Server, playerService: PlayersService): Promise<void> {

        ball.x = HEIGHT/2;
        ball.y = WIDTH/2;
        switch (info.difficulty) {
          case DifficultyLevel.EASY:
            ball.speed = 5;
            ball.xspeed = 3;
            ball.yspeed = 3;
            break;
          case DifficultyLevel.MEDIUM:
            ball.speed = 9;
            ball.xspeed = 6;
            ball.yspeed = 6;
            break;
          case DifficultyLevel.HARD:
            ball.speed = 11;
            ball.xspeed = 7;
            ball.yspeed = 7;
            break;
        }

        ball.xspeed *= [1,-1][Math.round(Math.random())];
        ball.yspeed *= [1,-1][Math.round(Math.random())];
        ball.last_touch_id = 0;

        const playerL: Player = await playerService.update(player_left.getId(), { score: player_left.getScore() })
        const playerR: Player = await playerService.update(player_right.getId(), { score: player_right.getScore() })

        server.to(room).emit('updateRoomInClient',
        {room: playerL.room} )
        server.to(room).emit('updateRoomInClient',
        {room: playerR.room} )
    }

    async function end_game(game: IGameInfoState, roomName: string, server: Server, playerService: PlayersService, roomsService: RoomsService, userService: UsersService): Promise<void>  {

      // console.log("END " + game.player_left.winner + game.player_right.winner );
      const roomId = await playerService.findRoomNumber(game.player_left.getId())
      const playerL: Player = await playerService.update(game.player_left.getId(), { winner: game.player_left.getWinner() })
      const playerR: Player = await playerService.update(game.player_right.getId(), { winner: game.player_right.getWinner() })
      game.info.status = GameState.OVER;
      server.to(roomName).emit('updateRoomInClient',
      {room: playerL.room} )
      server.to(roomName).emit('updateRoomInClient',
      {room: playerR.room} )
      const room: Room = await roomsService.update(roomId, {state: GameState.OVER})
      server.to(roomName).emit('updateRoomInClient',
        {room: room} )
      if (game.info.mode == "ladder") {
        const ladder_left: number =  await userService.findOneLadderLevel(game.player_left.getUserId())
        const ladder_right: number =  await userService.findOneLadderLevel(game.player_right.getUserId())
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
        if ( this.game[event.room].player_left.getUserId() == event.user_id ) {
            this.game[event.room].player_left.paddle.move = event.move;
        }
        else if ( this.game[event.room].player_right.getUserId() == event.user_id ) {
            this.game[event.room].player_right.paddle.move = event.move;
        }
    }

    // TODO: if game end: disconnect all client sockets from game room
  }