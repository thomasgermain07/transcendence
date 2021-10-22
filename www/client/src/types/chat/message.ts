import { UserType } from '../user/user';
import { RoomType } from './room';

export type MessageType = {
	author: UserType;
	room: RoomType;
	content: String;
};
