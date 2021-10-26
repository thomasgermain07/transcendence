import { reactive } from '@vue/reactivity';

import { createToast } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css';

import getCreateMessage from '../Messages/createMessage';
import getFetchMessages from '../Messages/fetchMessages';
import getCreatePermission from './createPermission';
import getFetchPermissions from './fetchPermissions';
import getFetchRoom from './fetchRoom';
import getDeletePermission from './deletePermission';
import getDeleteSubscription from '@/composables/Chat/Subscription/deleteSubscription';
import getDeleteRoom from '@/composables/Chat/Room/deleteRoom';

import { PermissionCreationType } from '@/types/chat/permission';
import { RoomDataType } from '@/types/chat/room_data';
import { AxiosErrType } from '@/composables/axios';

import { useSocket } from '@/composables/socket';
import { useChat } from '../useChat';

const { fetchRoom } = getFetchRoom();
const { fetchMessages } = getFetchMessages();
const { createMessage } = getCreateMessage();
const { fetchPermissions } = getFetchPermissions();
const { createPermission } = getCreatePermission();
const { deletePermission } = getDeletePermission();
const { deleteSubscription } = getDeleteSubscription();
const { deleteRoom } = getDeleteRoom();

let roomData = reactive<RoomDataType>({
	room: undefined,
	messages: [],
	moderators: [],
	muted: [],
	banned: [],
	page: 1,
	max_msg: false,
	open_setting: false,
});

export function useRoom() {
	const getData = async (id: number) => {
		try {
			roomData.room = await fetchRoom(id);
			roomData.messages = await fetchMessages(id, 1);
			roomData.moderators = await fetchPermissions(id, 'moderator');
			roomData.muted = await fetchPermissions(id, 'muted');
			roomData.banned = await fetchPermissions(id, 'banned');
		} catch (e: AxiosErrType) {
			createToast(e.response.data.message, { type: 'danger' });
			await useChat().reloadRooms();
			return 'error';
		}
	};

	const reloadRoom = async () => {
		if (roomData.room) {
			getData(roomData.room.id as number);
		}
	};

	const getMessages = async (id: number, page: number) => {
		try {
			let messages = await fetchMessages(id, page);
			return messages;
		} catch (e: any) {
			throw e;
		}
	};

	const sendMessage = async (room_id: number, msg: string) => {
		try {
			let res = await createMessage(room_id, msg);
			return res;
		} catch (e: AxiosErrType) {
			createToast(e.response.data.message, {
				type: 'success',
			});
			return e.response;
		}
	};

	const setPermission = async (permission: PermissionCreationType) => {
		try {
			await createPermission(permission);
		} catch (e) {
			throw e;
		}
	};

	const revokePermission = async (userId: number, roomId: number) => {
		try {
			await deletePermission(userId, roomId);
		} catch (e) {}
	};

	const isModerator = (userID: number) => {
		return (
			roomData.moderators.findIndex((perm) => perm.user.id == userID) != -1
		);
	};

	const isMuted = (userID: number) => {
		return roomData.muted.findIndex((perm) => perm.user.id == userID) != -1;
	};

	const getMuted = (userId: number) => {
		let index = roomData.muted.findIndex((perm) => perm.user.id == userId);
		return roomData.muted[index];
	};

	const isBanned = (userId: number) => {
		return roomData.banned.findIndex((perm) => perm.user.id == userId) != -1;
	};

	const leave = async () => {
		let roomId = roomData.room?.id;
		if (!roomId) {
			return;
		}

		await deleteSubscription(roomId as number)
			.then(() => {
				useSocket('chat').socket.emit('leave', { room_id: roomId });
				createToast('Successfully left the room', {
					type: 'success',
				});
				resetData()
			})
			.catch(() => {
				useSocket('chat').socket.emit('leave', { room_id: roomId });
				createToast('Room has been deleted', {
					type: 'danger',
				});
			});
	};

	const destroyRoom = async () => {
		try {
			await deleteRoom(roomData.room!.id as number);
			createToast('Successfuly deleted the room', {
				type: 'success',
			});
		} catch (e) {}
	};

	const resetData = () => {
		roomData.room = undefined;
		roomData.max_msg = false;
		roomData.page = 1;
		roomData.messages.length = 0;
		roomData.open_setting = false;
		roomData.messages = [];
		roomData.moderators = [];
		roomData.muted = [];
		roomData.banned = [];
	};

	return {
		roomData,
		getData,
		getMessages,
		reloadRoom,
		sendMessage,
		setPermission,
		revokePermission,
		isModerator,
		isMuted,
		getMuted,
		isBanned,
		leave,
		resetData,
		destroyRoom,
	};
}
