import { UserType } from '../user/user';
import { RoomType } from './room';

export type PermissionType = {
	user: UserType;
	room: RoomType;
	type: 'moderator' | 'muted' | 'banned';
	expired_at: Date | null;
};

export type PermissionCreationType = {
	user_id: number;
	room_id: number;
	type: 'moderator' | 'muted' | 'banned';
	expired_at: Date | null;
};
