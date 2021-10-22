import { UserType } from '../user/user';
import { RoomType } from './room';

export type ConversationType = {
	type: 'room' | 'dm';
	target: RoomType | UserType;
	notification?: Boolean;
};
