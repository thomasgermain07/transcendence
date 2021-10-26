import { ref, computed } from 'vue';

import { UserType } from '@/types/user/user';
import { FriendType } from '@/types/friend/friend';

import { useSocket } from '../socket';
import { useAuth } from '../auth';

import getFetchFriends from './fetchFriends';
import getFetchIgnored from '../Ignored/fetchIgnored';
import getFetchRequests from './fetchRequests';

const { fetchFriends } = getFetchFriends();
const { fetchIgnored } = getFetchIgnored();
const { fetchRequests } = getFetchRequests();

const friendsList = ref<FriendType[]>([]);
const ignoredList = ref<FriendType[]>([]);
const requestsList = ref<FriendType[]>([]);

export function useFriends() {
	let me = useAuth().user;

	const loadData = async () => {
		friendsList.value = await fetchFriends() ?? [];
		ignoredList.value = await fetchIgnored() ?? [];
		requestsList.value = await fetchRequests() ?? [];
	};

	const reloadFriends = async () => {
		friendsList.value = await fetchFriends() ?? [];
	};

	const reloadIgnored = async () => {
		ignoredList.value = await fetchIgnored() ?? [];
	};

	const reloadRequests = async () => {
		requestsList.value = await fetchRequests() || [];
	};

	const friends = computed(() => {
		let friends: UserType[] = [];

		friendsList.value.forEach((friend: FriendType) => {
			if (friend.user.id != me.id) {
				friends.unshift(friend.user);
			} else {
				friends.unshift(friend.target);
			}
		});

		return friends;
	});

	const ignored = computed(() => {
		let ignored: UserType[] = [];

		ignoredList.value.forEach((relation: FriendType) => {
			if (relation.user.id != me.id) {
				ignored.unshift(relation.user);
			} else {
				ignored.unshift(relation.target);
			}
		});

		return ignored;
	});

	const requests = computed(() => {
		return requestsList.value.filter(
			(request: FriendType) => request.target.id == useAuth().user.id,
		);
	});

	const hasPendingInvite = (user: UserType) => {
		if (
			requestsList.value.findIndex((request) => {
				return request.target.id == user.id;
			}) != -1
		) {
			return true;
		}
		return false;
	};

	const isBlocked = (id: number) => {
		return ignored.value.findIndex((user) => user.id == id) != -1;
	};

	const joinSocket = () => {
		useSocket('user').socket.emit('join', { target_id: useAuth().user.id });
		friends.value.forEach((friend) => {
			useSocket('user').socket.emit('join', { target_id: friend.id });
		});
	};

	const listenSocket = () => {
		useSocket('user').socket.on('set_status', (params) => {
			if (params.user_id != useAuth().user.id) {
				let user = friends.value.find((friend) => {
					return friend.id == params.user_id;
				});

				if (user) {
					user.status = params.status;
				}
			}
		});
	};

	return {
		friends,
		ignored,
		requests,
		loadData,
		joinSocket,
		listenSocket,
		reloadFriends,
		reloadIgnored,
		reloadRequests,
		hasPendingInvite,
		isBlocked,
	};
}
