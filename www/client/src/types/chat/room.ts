import { UserType } from '../user/user';

export type RoomType = {
	id: number;
	name: string;
	owner: UserType;
	visible: boolean;
	password: boolean;
	notification: boolean;
};
