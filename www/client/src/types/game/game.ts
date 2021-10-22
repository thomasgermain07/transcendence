/*
GAME VUE TYPES AND INTERFACES
*/
import { Player } from './player';
import { Ball } from './ball';
import { IMapPaddleState } from './paddle';
import { Bonus } from './bonus';

export type InGameType = {
	inGame: boolean;
	roomRoute: string;
	player?: Player;
};

export type LobbyType = {
	visible: boolean;
	matched: boolean;
	player: Player | null;
};

export interface IGameState {
	status: string;
	difficulty: string;
	mode: string;
	powerUps: boolean;
	begin: boolean;
	map: string;
	count: number;
}

export interface Game {
	player_left: Player;
	player_right: Player;
	ball: Ball;
	info: IGameState;
	map_paddle: IMapPaddleState[];
	addon_ball: Ball;
	bonus: Bonus;
}
