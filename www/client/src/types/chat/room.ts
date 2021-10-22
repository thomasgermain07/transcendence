import { UserType } from '../user/user';

export type RoomType = {
	id: Number;
	name: String;
	owner: UserType;
	visible: Boolean;
	password: Boolean;
	notification: Boolean;
};
