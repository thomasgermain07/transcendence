import { UserType } from '../user/user';

export type DirectMessageType = {
	id: number;
	author: UserType;
	target: UserType;
	content: string;
};
