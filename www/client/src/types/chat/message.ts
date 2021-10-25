import { UserType } from '../user/user';
import { RoomType } from './room';

export type MessageType = {
	id: number;
	author: UserType;
	room: RoomType;
	content: string;
};
