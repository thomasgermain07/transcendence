import { router } from '@/router';
import { openModal } from 'jenesius-vue-modal';

import { useFriends } from './Friends/useFriends';
import { useRoom } from './Chat/Room/useRoom';

import getUserInteraction from '@/composables/User/getUserInteraction';

import DuelCreaction from '@/components/game/duel/DuelCreation.vue';

import { UserType } from '@/types/user/user';
import { PermissionCreationType } from '@/types/chat/permission';
import { useWindowInteraction } from './Chat/WindowInteraction/useWindowInteraction';
import getInvitationInteraction from './Game/invitationInteraction';
import { useAuth } from './auth';

import { useGameInvite } from './Game/useGameInvite';

const { removeFriend, blockUser, unblockUser } = getUserInteraction();

export function useContextMenu() {
	const onProfile = (user: UserType) => {
		if (user != undefined) {
			router.push({
				name: 'user-profile',
				params: { id: user.id },
			});
		}
	};

	const onOpenDm = (user: UserType) => {
		useWindowInteraction().openDm(user);
	};

	const onSendDuel = async (user: UserType) => {
		if (user.status == 'ingame') {
			useGameInvite().inviteError(user.name + ' is already in game');
			return;
		}
		if (await getInvitationInteraction().hasPendingInvite(useAuth().user.id)) {
			useGameInvite().inviteError(
				'You already sent a game invite to ' + user.name,
			);
			return;
		}
		if (useFriends().isBlocked(user.id)) {
			useGameInvite().inviteError("You can't invite a blocked user");
			return;
		}

		useWindowInteraction().closeChat();
		openModal(DuelCreaction, {
			Target: user,
		});
	};

	const onDeleteFriend = async (user: UserType) => {
		await removeFriend(user);
		useFriends().reloadFriends();
	};

	const onBlockUser = async (user: UserType) => {
		await blockUser(user);
		useFriends().reloadIgnored();
	};

	const onUnblockUser = async (user: UserType) => {
		await unblockUser(user);
		useFriends().reloadIgnored();
	};

	const onSetModerator = async (userID: number, roomID: number) => {
		let permission: PermissionCreationType = {
			user_id: userID,
			room_id: roomID,
			type: 'moderator',
			expired_at: null,
		};

		try {
			await useRoom().setPermission(permission);
		} catch (e) {}
	};

	const onRevokeModerator = async (user: UserType, roomId: number) => {
		try {
			await useRoom().revokePermission(user.id, roomId);
		} catch (e) {}
	};

	const onMuteUser = async (userID: number, roomID: number, time: Date) => {
		let permission: PermissionCreationType = {
			user_id: userID,
			room_id: roomID,
			type: 'muted',
			expired_at: time,
		};

		try {
			await useRoom().setPermission(permission);
		} catch (e) {}
	};

	const onBanUser = async (userId: number, roomId: number) => {
		let permission: PermissionCreationType = {
			user_id: userId,
			room_id: roomId,
			type: 'banned',
			expired_at: null,
		};

		try {
			await useRoom().setPermission(permission);
		} catch (e) {}
	};

	const onUnbanUser = async (userId: number, roomId: number) => {
		try {
			await useRoom().revokePermission(userId, roomId);
		} catch (e) {}
	};

	return {
		onProfile,
		onOpenDm,
		onSendDuel,
		onDeleteFriend,
		onBlockUser,
		onUnblockUser,
		onSetModerator,
		onRevokeModerator,
		onMuteUser,
		onBanUser,
		onUnbanUser,
	};
}
