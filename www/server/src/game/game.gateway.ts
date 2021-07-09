import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection } from "@nestjs/websockets";
import { SubscribeMessage, MessageBody }     from "@nestjs/websockets";

import { Server, Socket } from "socket.io";
import Player from "src/players/entities/player.entity";
import { async } from "rxjs";

export interface IGameState {
   status: string
   mode: string
   addons: boolean
   map: string

}

export interface IBallState {
    x: number
    y: number
    rayon: number
    xspeed: number
    yspeed: number
    last_touch_id: number
}

export interface IPlayerState {
    id: number
    user_id: number
    position: string
    score: number
    winner: boolean
    is_ready: boolean
    x: number
    y: number
    speed: number
    move: string
}

export interface IGameInfoState{

    player_left: IPlayerState,
    player_right: IPlayerState,
    ball: IBallState,
}

type Move = {
    room: string;
    move: string;
    user_id: number;
}

export class Game implements IGameInfoState {

        player_left: IPlayerState;
        player_right: IPlayerState;
        ball: IBallState;
    constructor(player_left: IPlayerState, player_right: IPlayerState, ball: IBallState) {
        this.player_left = player_left;
        this.player_right = player_right;
        this.ball = ball;
    }
}

@WebSocketGateway({
	namespace: 'game',
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"]
	}
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection
{

	@WebSocketServer()

    server: Server;
    game: {[index: string] : IGameInfoState} = {};

    // player_left: IPlayerState = {
    //     id: 0 ,
    //     user_id: 0,
    //     position:  '',
    //     score:  0,
    //     winner:  false,
    //     is_ready:  false,
    //     x:  0,
    //     y:  0,
    //     speed: 0,
    //     move:  "",
    // };
    // player_right: IPlayerState = {
    //     id: 0 ,
    //     user_id: 0,
    //     position:  '',
    //     score:  0,
    //     winner:  false,
    //     is_ready:  false,
    //     x:  0,
    //     y:  0,
    //     speed: 0,
    //     move:  "",
    // };

    // ball: IBallState = {
    //     x: 0,
    //     y: 0,
    //     rayon: 0,
    //     xspeed: 0,
    //     yspeed: 0,
    //     last_touch_id: 0,
    // };
    // game[]: IGameInfoState = {
    //     player_left:<IPlayerState>{
    //         id: 0 ,
    //         user_id: 0,
    //         position:  '',
    //         score:  0,
    //         winner:  false,
    //         is_ready:  false,
    //         x:  0,
    //         y:  0,
    //         speed: 0,
    //         move:  "",
    //     },
    // }

    afterInit(server: Server) {
        console.log("AFTER INIT");
    }

    handleConnection() {
        console.log('new connection!');
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, room: string) {
        console.log("JOIN ROOM");
        // console.log(room);
        client.join(room);
        client.emit("joinedRoom", room);
    }

    @SubscribeMessage('begin')
	handleStart(
		@MessageBody() begin: object
	)
		: void
	{
        // console.log("jhgdjhqsgddghqsdghdqhgdsqghqdsdqghjgh");
        // console.log(begin);
        if ( begin["begin"]) {
            // this.server.emit('loop', {player_left: this.player_left, player_right: this.player_right, ball: this.ball});
            // start(this.game[begin["room"]].player_left, this.game[begin["room"]].player_right, this.game[begin["room"]].ball, this.game[begin["room"]].server, begin["ctx"], begin["room"]);
            start(this.game[begin["room"]], begin["ctx"], begin["room"], this.server);
            // function start(player_left: IPlayerState, player_right: IPlayerState, ball: IBallState, server: Server, ctx: any, room: string ): void {
            function start(game: IGameInfoState, ctx: any, room: string, server: Server): void {
                // console.log("IN START GATEWAY");
                // console.log(game);
                // while (i < 300) {
                    let player_left = game.player_left;
                    let player_right = game.player_right;
                    let ball = game.ball;
                    // let server = game[room].server;

                    if ( player_left.move == "up" ) {
                        const upy = player_left.y - player_left.speed;
                        player_left.y = (upy <= 0) ? 0 : upy;
                    }
                    else if (player_left.move == "down" ) {
                        const downy = player_left.y + player_left.speed;
                        player_left.y = (downy + 80 ) >= 400 ? 400 - 80 : downy;
                    }
    
                    if ( player_right.move == "up" ) {
                        const upy = player_right.y - player_right.speed;
                        player_right.y = (upy <= 0) ? 0 : upy;
                    }
                    else if (player_right.move == "down" ) {
                        const downy = player_right.y + player_right.speed;
                        player_right.y = (downy + 80 ) >= 400 ? 400 - 80 : downy;
                    }
    
    
                    ball.x += ball.xspeed;
                    ball.y += ball.yspeed;
    
                    const topX = ball.x + ball.rayon;
                    const topY = ball.y + ball.rayon;
                    const botX = ball.x - ball.rayon;
                    const botY = ball.y - ball.rayon;
                    
                    if ( botY < 0 ) {
                        ball.y = ball.rayon;
                        ball.yspeed *= -1;
                    }
                    else if ( topY > 400 ) {
                        ball.y = 400 - ball.rayon;
                        ball.yspeed *= -1;
                    }
    
                    if ( botX >= player_left.x && botX <= player_left.x + 600/80 ) {
                        if ( botY <= player_left.y + 80 && topY >= player_left.y ) {
                            ball.last_touch_id = player_left.id;
                            bounce(ball);
                        }
                    }
                    else if ( topX <= player_right.x + 600/80 && topX >= player_right.x ) {
                        if ( botY <= player_right.y + 80 && topY >= player_right.y ) {
                            ball.last_touch_id = player_right.id;
                            bounce(ball);
                        } 
                    }
    
                    if ( ball.x + ball.rayon <= 0 || ball.x - ball.rayon >= 600 ) {
                        if ( ball.x <= 0 ) {
                            player_right.score += 1;
                        }
                        else {
                            player_left.score += 1;
                        }
                        init_match(player_left, player_right, ball);
                    }
                    // console.log(room);
                    server.to(room).emit('begin', {player_left: player_left, player_right: player_right, ball: ball, ctx: ctx});
                    game.player_left = player_left;
                    game.player_right = player_right;
                    game.ball = ball;
                    // game[room].server = server;
                    if (player_right.score != 20 && player_left.score != 20)
                        setTimeout(function() {start(game, ctx, room, server)}, 1000/60)
                // }
           
            }
    
            // async function sleep( ms: number ) {
            //     console.log("wait");
            //     await delay(ms);
            // }
    
            // function delay(ms: number ) {
            //     return new Promise( resolve => setTimeout(resolve, ms) );
            // }
    
            function init_match(player_left: IPlayerState, player_right: IPlayerState, ball: IBallState): void {
                player_left.y = 400/2 - 40;
                player_left.move = "not";
    
                player_right.y = 400/2 - 40;
                player_right.move = "not";
    
                ball.x = 600/2;
                ball.y = 400/2;
                ball.xspeed = 3;
                ball.yspeed = 3;
    
                ball.xspeed *= [1,-1][Math.round(Math.random())];
                ball.yspeed *= [1,-1][Math.round(Math.random())];
            }
    
            function bounce(ball: IBallState): void {
                ball.yspeed *= 1;
                ball.xspeed *= -1;
                ball.yspeed += 0.6;
                ball.xspeed += 0.4;
                ball.x += ball.xspeed;
                ball.y += ball.yspeed;
            }
            // this.server.emit('message', data);
        }
        
    }

	

    @SubscribeMessage('init')
	handleInit(
		@MessageBody() data: object
	)
		: void
	{
        const player_left: IPlayerState = {
            id: 0 ,
            user_id: 0,
            position:  '',
            score:  0,
            winner:  false,
            is_ready:  false,
            x:  0,
            y:  0,
            speed: 0,
            move:  "",
        };
        const player_right: IPlayerState = {
            id: 0 ,
            user_id: 0,
            position:  '',
            score:  0,
            winner:  false,
            is_ready:  false,
            x:  0,
            y:  0,
            speed: 0,
            move:  "",
        };
    
        const ball: IBallState = {
            x: 0,
            y: 0,
            rayon: 0,
            xspeed: 0,
            yspeed: 0,
            last_touch_id: 0,
        };
        // console.log(this.player_right);
        // console.log(this.player_left);
        if (!this.game[data["room"]]) {
            this.game[data["room"]] = new Game(player_left, player_right, ball);
        }
        // if (!this.game[data["room"]]) {
        //     this.game[data["room"]] = {player_left: this.player_left, player_right: this.player_right, ball: this.ball, server: this.server};
        // }

        console.log(this.game[data["room"]]);
        console.log(this.game["hello"]);
        // console.log(this.player_right);
        if ( data["data"]["position"] == "left" ) {
            // console.log("IF IF IF IF IF");
            this.game[data["room"]].player_left["id"] = data["data"]["id"];
            this.game[data["room"]].player_left["user_id"] = data["data"]["user"]["id"];
            this.game[data["room"]].player_left["position"] = "left";
            this.game[data["room"]].player_left["score"] = 0;
            this.game[data["room"]].player_left["winner"] = false;
            this.game[data["room"]].player_left["is_ready"] = true;
            this.game[data["room"]].player_left["x"] = 600/10;
            this.game[data["room"]].player_left["y"] = 400/2 - 40;
            this.game[data["room"]].player_left["speed"] = 7;
            this.game[data["room"]].player_left["move"] = "";
            }
        else {
            // console.log("ELSE ELSE ELSE ELSE");
            this.game[data["room"]].player_right["id"] = data["data"]["id"];
            this.game[data["room"]].player_right["user_id"] = data["data"]["user"]["id"];
            this.game[data["room"]].player_right["position"] = "right";
            this.game[data["room"]].player_right["score"] = 0;
            this.game[data["room"]].player_right["winner"] = false;
            this.game[data["room"]].player_right["is_ready"] = true;
            this.game[data["room"]].player_right["x"] = 600/1.1;
            this.game[data["room"]].player_right["y"] = 400/2 - 40;
            this.game[data["room"]].player_right["speed"] = 7;
            this.game[data["room"]].player_right["move"] = "";
        }
        this.game[data["room"]].ball["x"] = 600/2;
        this.game[data["room"]].ball["y"] = 400/2;
        this.game[data["room"]].ball["rayon"] = 5;
        this.game[data["room"]].ball["xspeed"] = 3;
        this.game[data["room"]].ball["yspeed"] = 3;
        // console.log("GAME ROOM DATA PRINT")
        // console.log([data["room"]]);
        // console.log(this.game[data["room"]]);
        // console.log(this.game["game_room_1"]);
        // this.server = this.server;
        this.server.to(data["room"]).emit('initClient', {player_left: this.game[data["room"]].player_left, player_right: this.game[data["room"]].player_right, ball: this.game[data["room"]].ball, room: data["room"]});
        // console.log("afetr emit init");

    }

    @SubscribeMessage('move')
	handleMove(
		@MessageBody() event: Move
	)
		: void
	{
        // console.log(event);
        if ( this.game[event.room].player_left.user_id == event.user_id ) {
            this.game[event.room].player_left.move = event.move;
        }
        else if ( this.game[event.room].player_right.user_id == event.user_id ) {
            this.game[event.room].player_right.move = event.move;
        }
		// this.server.emit('message', data);
    }
    


    // handleConnection(client: Socket, ...args: any[]) {
    //     this.server.
    //    }
    
    
}
