/*
    GAME ROOM TYPES AND INTERFACES
*/

import { UserType } from '../user/user';
import { Room } from './gameRoom';
import { IMapPaddleState } from './paddle';

export interface Player {
	id: number;
	position: string;
	score: number;
	winner: boolean | null;
	isReady: boolean;
	isPause: boolean;
	user: UserType | null;
	room: Room | null;
	paddle: IMapPaddleState;
}
