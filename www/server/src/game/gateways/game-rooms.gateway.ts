import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SubscribeMessage, MessageBody }     from "@nestjs/websockets";
import { ConnectedSocket }                   from '@nestjs/websockets';

import { Server, Socket, RemoteSocket } from 'socket.io';

import { UseInterceptors, ClassSerializerInterceptor, UseGuards } from '@nestjs/common';

import { RoomsService }   from '../rooms/services/rooms.service';
import { PlayersService } from '../players/services/players.service';
import { Player }         from '../players/entities/player.entity';
import { Room }           from '../rooms/entities/room.entity';
import { UsersService } from 'src/users/services/users.service';
import { GameState, DifficultyLevel, MapType, Direction, GameMode } from '../enum/enum';
import { SocketRoomInfo, UpdateRoomType, Move, Pause } from '../type/type';
import { IGameInfoState, IBonusState, IGameState, Game } from '../interface/interface';
import { Ball } from './ball';
import { Bonus } from './bonus'
import { Paddle } from './paddle';
import { GamePlayer } from './game_player';
import { WsJwtGuard } from '../../auth/guards/ws-jwt.guard';


export const WIDTH = 400
export const HEIGHT = 600
export const MAXSCORE = 5
export const LEFT = "left"
export const RIGHT = "right"
export class State implements IGameState {
  status: string
  readonly difficulty: string
  readonly mode: GameMode
  readonly addons: boolean
  begin: boolean
  readonly map: string
  count: number
  count_pause: number
  interval: ReturnType<typeof setInterval>
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
    this.count_pause = -1;
    this.interval = null;
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
    if (!client.handshake?.headers?.cookie) {
      client.disconnect()
    }
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

  @SubscribeMessage('cancelRoom')
  async cancelRoom(
    @MessageBody() data: SocketRoomInfo,
  ): Promise<void> {
    
    // notify all players that room has been canceled
    this.server.in(data.room).emit('roomCanceled')

    // remove all sockets from room
    const sockets = await this.server.in(data.room).fetchSockets()
    sockets.forEach((socket: Socket | RemoteSocket<any>) => {
      socket.leave(data.room)
    });
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
    if (this.game[data.room].player_left.getId() == data.playerId ) {
      this.set_winner(data.room, RIGHT)
    }
    else {
      this.set_winner(data.room, LEFT)
    }
    await this.playerService.update( this.game[data.room].player_left.getId() ,{ winner: this.game[data.room].player_left.getWinner(), mode: room.mode })
    await this.playerService.update( this.game[data.room].player_right.getId() ,{ winner: this.game[data.room].player_right.getWinner(), mode: room.mode })
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

      const player: Player = await this.playerService.update(data.playerId, { isReady: true, isPause: false })

      this.server.to(data.room).emit('updateRoomInClient',
        {room: player.room} )

      client.to(data.room).emit('checkReady',
        {room: player.room} );
  }

  @SubscribeMessage('stopPause')
  async stopPause(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SocketRoomInfo
  ): Promise<void> {

      const player: Player = await this.playerService.update(data.playerId, { isReady: true, isPause: false })
      const room: Room = await this.roomsService.findOne(player.room.id)
      this.server.to(data.room).emit('updateRoomInClient',
        {room: room} )

      client.to(data.room).emit('checkStopPause',
        {room: room} );
  }

  @SubscribeMessage('notReady')
  async notReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SocketRoomInfo
  ): Promise<void> {

    try {
      await this.playerService.update(data.playerId, { isReady: false, isPause: false })
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
      if (!this.game[data["socketRoomName"]]) {

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
            paddle_left = new Paddle(HEIGHT/10, WIDTH/2 - 40, 5, Direction.NOT, 8);
            paddle_right = new Paddle(HEIGHT/1.1, WIDTH/2 - 40, 5, Direction.NOT, 8);
            break;
          case DifficultyLevel.MEDIUM:
            ball = new Ball(9, 6, 6);
            paddle_left = new Paddle(HEIGHT/10, WIDTH/2 - 40, 5, Direction.NOT, 9);
            paddle_right = new Paddle(HEIGHT/1.1, WIDTH/2 - 40, 5, Direction.NOT, 9);
            break;
          case DifficultyLevel.HARD:
            ball = new Ball(11, 7, 7);
            paddle_left = new Paddle(HEIGHT/10, WIDTH/2 - 40, 5, Direction.NOT, 10);
            paddle_right = new Paddle(HEIGHT/1.1, WIDTH/2 - 40, 5, Direction.NOT, 10);
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
        this.game[data["socketRoomName"]] = new Game(player_left, player_right, ball, info, map_paddle, bonus);
      }
      else {
        clearInterval(this.game[data["socketRoomName"]].info.interval)
        if (this.game[data["socketRoomName"]].info.status === GameState.PLAYING) {
          return
        }
        this.game[data["socketRoomName"]].info.count = 3
        this.game[data["socketRoomName"]].info.count_pause = -1
        this.game[data["socketRoomName"]].info.status = GameState.PLAYING
      }

      this.start(data["socketRoomName"]);
  }

  async start(room: string) : Promise<void>
  {
    if (this.game[room].info.status === GameState.OVER)
      return
    let players : GamePlayer[] = []
    players.push(this.game[room].player_left, this.game[room].player_right)
    
    if (this.game[room].info.count >= 0) {
      this.server.to(room).emit('begin', {player_left: this.game[room].player_left, player_right: this.game[room].player_right, 
        ball: this.game[room].ball, info: this.game[room].info, map_paddle: this.game[room].map_paddle, bonus: this.game[room].bonus});
      setTimeout(() => this.start(room), 1000)
      this.game[room].info.count -= 1
    }
    else if (this.game[room].info.count_pause < 0) {
      players.forEach(async (player : GamePlayer) => {
        await this.playerService.update(player.getId(), { isReady: true, isPause: false })
      })
      this.game[room].info.status = GameState.PLAYING
      this.game_loop(room)
    }
  }

  async game_loop(room: string): Promise<void> {

    var myVar = null;
    let players : GamePlayer[] = []

    this.game[room].player_left.paddle.paddle_move(this.game[room].ball);
    this.game[room].player_right.paddle.paddle_move(this.game[room].ball);

    players.push(this.game[room].player_left, this.game[room].player_right)

    for (var paddle of this.game[room].map_paddle) {
        paddle.paddle_move(this.game[room].ball);
        if ( paddle.y == 0 ) {
            paddle.move = Direction.DOWN;
        }
        else if ( paddle.y == WIDTH - 80 ) {
            paddle.move = Direction.UP;
        }
    }

    const topY = this.game[room].ball.y + this.game[room].ball.rayon;
    const botY = this.game[room].ball.y - this.game[room].ball.rayon;

    if ( botY <= 0 || topY >= WIDTH) {
      this.game[room].ball.yspeed *= -1;
    }

    this.game[room].ball.addSpeedBall()

    players.forEach((player : GamePlayer) => {
      this.player_ball_collision(room, player.paddle, player.getId());
    })
  
    for (var paddle of this.game[room].map_paddle) {
        this.player_ball_collision(room, paddle, 0);
    }

    if ( this.game[room].info.addons )
    {
      if (!this.game[room].bonus.exist && (Date.now() - this.game[room].bonus.time) >= 3000) {
        this.game[room].bonus.startBonus();
      }
    }
    if ( this.game[room].bonus.exist ) {
      this.game[room].bonus.ballBonusCollision(this.game[room].ball);
      this.active_bonus_on_player(room);
    }

    this.game[room].player_left.checkChangePaddleSize();
    this.game[room].player_right.checkChangePaddleSize();

    if ( this.game[room].ball.x + this.game[room].ball.rayon <= 0 || this.game[room].ball.x - this.game[room].ball.rayon >= HEIGHT ) {
      if ( this.game[room].ball.x <= 0 ) {
        this.game[room].player_right.addScore();
      }
      else {
        this.game[room].player_left.addScore();
      }
      this.init_match(room);
    }

    if (this.game[room].player_right.getScore() != MAXSCORE
      && this.game[room].player_left.getScore() != MAXSCORE
      && (this.game[room].info.status == GameState.PLAYING)){
      this.server.to(room).emit('begin', {player_left: this.game[room].player_left, player_right: this.game[room].player_right,
        ball: this.game[room].ball, info: this.game[room].info, map_paddle: this.game[room].map_paddle, bonus: this.game[room].bonus});
      myVar = setTimeout(() => this.game_loop(room), 1000/60)
    }
    else if (this.game[room].info.status == GameState.PAUSE)
    {
      return
    }
    else {
      const roomId: number = await this.playerService.findRoomNumber(this.game[room].player_left.getId())
      this.game[room].info.status = GameState.OVER;
      await this.roomsService.update(roomId, {state: GameState.OVER})
      clearTimeout(myVar);
      clearInterval(this.game[room].info.interval)
      if (this.game[room].player_left.getScore() == MAXSCORE) {
        this.set_winner(room, LEFT)
      }
      else if (this.game[room].player_right.getScore() == MAXSCORE ) {
        this.set_winner(room, RIGHT)
      }
      this.end_game(room)
      this.server.to(room).emit('begin', {player_left: this.game[room].player_left, player_right: this.game[room].player_right,
        ball: this.game[room].ball, info: this.game[room].info, map_paddle: this.game[room].map_paddle, bonus: this.game[room].bonus});
      return
    }
  }

  set_winner(room: string, winner: string) {
    if (winner === LEFT && this.game[room].player_left.getWinner() === null) {
      this.game[room].player_left.setWinner(true);
      this.game[room].player_right.setWinner(false);
    }
    else if (winner === RIGHT && this.game[room].player_right.getWinner() === null) {
      this.game[room].player_right.setWinner(true);
      this.game[room].player_left.setWinner(false);
    }
  }

  player_ball_collision(room: string, paddle: Paddle, id: number) : void {

    const topX = this.game[room].ball.x + this.game[room].ball.rayon;
    const topY = this.game[room].ball.y + this.game[room].ball.rayon;
    const botX = this.game[room].ball.x - this.game[room].ball.rayon;
    const botY = this.game[room].ball.y - this.game[room].ball.rayon;

    const paddleTop = paddle.y;
    const paddleRight = paddle.x + HEIGHT/80;
    const paddleBot = paddle.y + (WIDTH / paddle.height);
    const paddleLeft = paddle.x;
    let angle = 0;

    if (botX < paddleRight && botY < paddleBot && topX > paddleLeft && topY > paddleTop)
    {
      let collidePoint = this.game[room].ball.y - (paddle.y + ((WIDTH / paddle.height)/2));

      collidePoint = collidePoint / ((WIDTH / paddle.height) / 2);

      angle = collidePoint * Math.PI/4;

      let direction = this.game[room].ball.x < HEIGHT/2 ? 1 : -1;
      this.game[room].ball.last_touch_id = id;
      if (id == 0) {
        if (this.game[room].info.map == MapType.MAP1) {
          this.game[room].ball.xspeed *= direction
          this.game[room].ball.yspeed = this.game[room].ball.speed * Math.sin(angle);
        }
        else {
          if (this.game[room].ball.x <= paddle.x) {
            this.game[room].ball.xspeed = -1 * this.game[room].ball.speed * Math.cos(angle);
            this.game[room].ball.yspeed = this.game[room].ball.speed * Math.sin(angle);
          }
          else {
            this.game[room].ball.xspeed = this.game[room].ball.speed * Math.cos(angle);
            this.game[room].ball.yspeed = this.game[room].ball.speed * Math.sin(angle);
          }
        }
      }
      else {
        this.game[room].ball.xspeed = direction * this.game[room].ball.speed * Math.cos(angle);
        this.game[room].ball.yspeed = this.game[room].ball.speed * Math.sin(angle);
      }
      this.game[room].ball.speed += 0.1;
    }
  }

  active_bonus_on_player(room: string) {

    let players : GamePlayer[] = []
    players.push(this.game[room].player_left, this.game[room].player_right)
    players.forEach((player : GamePlayer) => {
      if ( player.getId() == this.game[room].bonus.last_touch_id ) {
        player.paddle.height = 3.2;
        player.addons_date = Date.now();
        this.game[room].bonus.exist = false;
      }
    })
  }

  async init_match(room: string): Promise<void> {

      this.game[room].ball.x = HEIGHT/2;
      this.game[room].ball.y = WIDTH/2;
      switch (this.game[room].info.difficulty) {
        case DifficultyLevel.EASY:
          this.game[room].ball.speed = 5;
          this.game[room].ball.xspeed = 3;
          this.game[room].ball.yspeed = 3;
          break;
        case DifficultyLevel.MEDIUM:
          this.game[room].ball.speed = 9;
          this.game[room].ball.xspeed = 6;
          this.game[room].ball.yspeed = 6;
          break;
        case DifficultyLevel.HARD:
          this.game[room].ball.speed = 11;
          this.game[room].ball.xspeed = 7;
          this.game[room].ball.yspeed = 7;
          break;
      }

      this.game[room].ball.xspeed *= [1,-1][Math.round(Math.random())];
      this.game[room].ball.yspeed *= [1,-1][Math.round(Math.random())];
      this.game[room].ball.last_touch_id = 0;

      await this.playerService.update(this.game[room].player_left.getId(), { score: this.game[room].player_left.getScore() })
      const playerR: Player = await this.playerService.update(this.game[room].player_right.getId(), { score: this.game[room].player_right.getScore() })
      this.server.to(room).emit('updateRoomInClient',
          {room: playerR.room} )
  }

  async end_game(roomName: string): Promise<void>  {
    
    await this.playerService.update(this.game[roomName].player_left.getId(), { winner: this.game[roomName].player_left.getWinner(), mode: this.game[roomName].info.mode })
    const playerR: Player = await this.playerService.update(this.game[roomName].player_right.getId(), { winner: this.game[roomName].player_right.getWinner(), mode: this.game[roomName].info.mode })
    this.server.to(roomName).emit('updateRoomInClient',
      {room: playerR.room} )

    if (this.game[roomName].info.mode == GameMode.LADDER) {
      let ladder_left: number =  await this.userService.findOneLadderLevel(this.game[roomName].player_left.getUserId())
      let ladder_right: number =  await this.userService.findOneLadderLevel(this.game[roomName].player_right.getUserId())

      if (this.game[roomName].player_left.getWinner() && ladder_left >= ladder_right
        || this.game[roomName].player_right.getWinner() && ladder_right >= ladder_left) {
          if (this.game[roomName].player_left.getWinner()) {
            const dif = ladder_left - ladder_right;
            ladder_left += (3 - dif > 1) ? 3 - dif : 1;
            ladder_right -= ((3 - dif)/2 > 1) ? Math.round((3 - (dif))/2) : 1;
          }
          else {
            const dif = ladder_right - ladder_left;
            ladder_right += (3 - dif > 1) ? 3 - dif : 1;
            ladder_left -= ((3 - dif)/2 > 1) ? Math.round((3 - dif)/2) : 1;
          }
      }
      else if (this.game[roomName].player_left.getWinner() && ladder_left < ladder_right
        || this.game[roomName].player_right.getWinner() && ladder_right < ladder_left) {

          if (this.game[roomName].player_left.getWinner()) {
            const dif = ladder_right - ladder_left;
            ladder_left += ((dif) - ((dif) * 40 / 100) > 1) ? Math.round((dif) - ((dif) * 40 / 100)) : 3 - dif;
            ladder_right -= ((dif) - ((dif) * 70 / 100) > 1) ? Math.round((dif) - ((dif) * 70 / 100)) : 3 - dif;
          }
          else {
            const dif = ladder_left - ladder_right;
            ladder_right += ((dif) - ((dif) * 40 / 100) > 1) ? Math.round((dif) - ((dif) * 40 / 100)) : 3 - dif;
            ladder_left -= ((dif) - ((dif) * 70 / 100) > 1) ? Math.round((dif) - ((dif) * 70 / 100)) : 3 - dif;
          }
      }
      await this.userService.updateLadderLevel(this.game[roomName].player_left.getUserId(), ladder_left)
      await this.userService.updateLadderLevel(this.game[roomName].player_right.getUserId(), ladder_right)
    }
    const rooms: Room[] = await this.roomsService.findAllByMode(this.game[roomName].info.mode)
    this.server.emit('updateWatchRoomInClient', {rooms: rooms})
  }
  
  @SubscribeMessage('move')
	handleMove(
		@MessageBody() event: Move
	)
		: void
	{
    if ( this.game[event.room].player_left.getUserId() == event.user_id ) {
        this.game[event.room].player_left.paddle.move = event.move;
    }
    else if ( this.game[event.room].player_right.getUserId() == event.user_id ) {
        this.game[event.room].player_right.paddle.move = event.move;
    }
  }

  @SubscribeMessage('pause')
	async handlePause(
		@MessageBody() event: Pause
	)
		: Promise<void>
	{
    if ( this.game[event.room].player_left.getUserId() == event.user_id ||
        this.game[event.room].player_right.getUserId() == event.user_id
    ){
      this.game[event.room].info.count_pause = 30
      this.game[event.room].info.count = -1
      if (this.game[event.room].player_left.getUserId() == event.user_id) {
        await this.playerService.update(this.game[event.room].player_left.getId(), { isReady: true, isPause: true })
      }
      else {
        await this.playerService.update(this.game[event.room].player_right.getId(), { isReady: true, isPause: true })
      }
      if (this.game[event.room].info.status === GameState.PAUSE)
      {
        return
      }
      if (this.game[event.room].info.status === GameState.OVER) {
        await this.playerService.update(this.game[event.room].player_left.getId(), { isReady: true, isPause: false })
        await this.playerService.update(this.game[event.room].player_right.getId(), { isReady: true, isPause: false })
        await this.updateRoom({
          socketRoomName: event.room,
          roomId: event.roomId,
          dto: { state: GameState.OVER }
        })
        const room: Room = await this.roomsService.findOne(event.roomId)
        this.server.to(event.room).emit('updateRoomInClient',
        {room: room} )
        return
      }
      this.game[event.room].info.status = GameState.PAUSE;
      await this.updateRoom({
        socketRoomName: event.room,
        roomId: event.roomId,
        dto: { state: GameState.PAUSE }
      })
      this.game[event.room].info.interval = setInterval(async () => {
        this.game[event.room].info.count_pause--
      if (this.game[event.room].info.status === GameState.OVER) {
        await this.playerService.update(this.game[event.room].player_left.getId(), { isReady: true, isPause: false })
        await this.playerService.update(this.game[event.room].player_right.getId(), { isReady: true, isPause: false })
        await this.updateRoom({
          socketRoomName: event.room,
          roomId: event.roomId,
          dto: { state: GameState.OVER }
        })
        return
      }
      if (  this.game[event.room].info.count_pause <= 0) {
          clearInterval(this.game[event.room].info.interval)
          await this.playerService.update(this.game[event.room].player_left.getId(), { isReady: true, isPause: false })
          await this.playerService.update(this.game[event.room].player_right.getId(), { isReady: true, isPause: false })
          await this.updateRoom({
            socketRoomName: event.room,
            roomId: event.roomId,
            dto: { state: GameState.PLAYING }
          })
          this.handleInit({socketRoomName: event.room})
          return 
      }
      else {
        this.server.to(event.room).emit('onPause', {count: this.game[event.room].info.count_pause})
      }
    }, 1000)
    }
  }

  sendPause(event: Pause): void {
    this.handlePause(event)
  }
    // TODO: if game end: disconnect all client sockets from game room
}