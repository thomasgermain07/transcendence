<template>
	<div class="room-ctn">
		<v-contextmenu ref="contextmenu">
			<RoomCM
				:User="cm_user"
				:IsModerator="isModerator(me.id)"
				:IsOwner="me.id == roomData.room?.owner.id"
				:Room="roomData.room"
			/>
		</v-contextmenu>

		<div class="content">
			<Setting
				v-if="roomData.open_setting"
				@close="roomData.open_setting = false"
				@leave="$emit('leave')"
			/>
			<!-- TODO (CSS) : Check why long messages with no space overflow on x axis -->
			<div class="messages-ctn" v-if="!roomData.open_setting">
				<div
					v-for="message in messages"
					:key="message.id"
					class="msg"
					:class="{ 'msg--from-me': message.author.id == me.id }"
				>
					<p
						v-if="message.author.id != me.id"
						class="msg__name"
						v-contextmenu:contextmenu
						@click.right="cm_user = message.author"
					>
						{{ message.author.name }}
						<i v-if="isModerator(message.author.id)" class="fas fa-crown"></i>
						<i
							v-if="message.author.id == roomData.room?.owner.id"
							class="fas fa-house-user"
						></i>
					</p>
					<p v-else class="msg__name">
						{{ message.author.name }}
						<i v-if="isModerator(message.author.id)" class="fas fa-crown"></i>
						<i
							v-if="message.author.id == roomData.room?.owner.id"
							class="fas fa-house-user"
						></i>
					</p>
					<span class="msg__content">{{ message.content }}</span>
				</div>

				<a
					v-if="!roomData.max_msg && roomData.messages.length >= 50"
					class="info info--clickable"
					@click="onMoreMsg"
				>
					load more</a
				>
				<div v-else-if="roomData.messages.length" class="info">
					no more messages
				</div>
				<div v-else class="info">No message yet</div>
			</div>
		</div>

		<div class="bar" v-if="!roomData.open_setting">
			<i
				class="fas fa-cogs setting-btn"
				@click="roomData.open_setting = !roomData.open_setting"
			></i>
			<div class="bar__input" v-if="!isMuted(me.id)">
				<input
					type="text"
					class="input__field"
					v-model="message_field"
					@keypress.enter="onSendMsg"
				/>
				<div class="input__btn" @click="onSendMsg">Send</div>
			</div>
			<div v-else class="input--muted">
				You are muted until {{ showDate(isMuted(me.id).expired_at) }}
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {
	computed,
	onMounted,
	onUnmounted,
	ref,
	watch,
	defineComponent,
} from 'vue';

import { useAuth } from '@/composables/auth';
import { useSocket } from '@/composables/socket';
import { useRoom } from '@/composables/Chat/Room/useRoom';

import { MessageType } from '@/types/chat/message';
import { UserType } from '@/types/user/user';

import Setting from './Settings/Setting.vue';
import RoomCM from './RoomCM.vue';
import { PermissionType } from '@/types/chat/permission';
import { useChat } from '@/composables/Chat/useChat';
import { useFriends } from '@/composables/Friends/useFriends';

export default defineComponent({
	props: {
		RoomId: Number,
	},
	components: {
		Setting,
		RoomCM,
	},
	setup(props, { emit }) {
		let message_field = ref('');
		let cm_user = ref<UserType>();
		let me = useAuth().user;

		const {
			roomData,
			getData,
			getMessages,
			sendMessage,
			isModerator,
			isMuted,
			resetData,
		} = useRoom();

		const onMoreMsg = async () => {
			roomData.page += 1;
			let size_before = roomData.messages.length;

			let newMsg = await getMessages(props.RoomId!, roomData.page);
			roomData.messages = roomData.messages.concat(newMsg);

			if (
				roomData.messages.length == size_before ||
				roomData.messages.length - size_before != 50
			) {
				roomData.max_msg = true;
			}
		};

		const onSendMsg = async () => {
			if (message_field.value.length) {
				await sendMessage(props.RoomId!, message_field.value);
				message_field.value = '';
			}
		};

		let socket = useSocket('chat').socket;

		const listenMessage = (message: MessageType) => {
			if (message.room.id == props.RoomId) {
				roomData.messages.unshift(message);
			}
		};

		const listenSetPermission = (permission: PermissionType) => {
			if (permission.room.id != roomData.room!.id) {
				if (permission.type == 'banned' && permission.user.id == me.id) {
					useChat().reloadRooms();
				}
				return;
			}

			if (permission.type == 'muted') {
				if (permission.user.id == me.id) {
					roomData.muted.unshift(permission);
					if (permission.expired_at) {
						startCountDown(permission.expired_at!);
					}
				}
			} else if (permission.type == 'moderator') {
				roomData.moderators.unshift(permission);
			} else if (permission.type == 'banned') {
				if (isModerator(permission.user.id)) {
					let index = roomData.moderators.findIndex(
						(mod) => mod.user.id == permission.user.id,
					);
					if (index != -1) {
						roomData.moderators.splice(index, 1);
					}
				}

				roomData.banned.unshift(permission);

				if (permission.user.id == me.id) {
					useChat().getBanFrom(roomData.room!.id as number);
					emit('close');
				}
			}
		};

		const listenRevokePermission = (permission: PermissionType) => {
			if (permission.room.id != roomData.room!.id) {
				return;
			}

			if (permission.type == 'moderator') {
				let index = roomData.moderators.findIndex(
					(perm) => perm.user.id == permission.user.id,
				);
				if (index != -1) {
					roomData.moderators.splice(index, 1);
				}
			}
		};

		onMounted(async () => {
			if ((await getData(props.RoomId!)) == 'error') {
				emit('close');
			}
			socket.on('message', listenMessage);
			socket.on('set_permission', listenSetPermission);
			socket.on('remove_permission', listenRevokePermission);
			checkIfMuted();
		});

		onUnmounted(() => {
			stopTimer();
			resetData();
			socket.off('message', listenMessage);
			socket.off('set_permission', listenSetPermission);
			socket.off('remove_permission', listenRevokePermission);
		});

		watch(
			() => props.RoomId,
			async () => {
				resetData();
				await getData(props.RoomId!);
				checkIfMuted();
			},
		);

		let interval = 0;

		const startCountDown = (until: Date) => {
			let date = new Date(until);
			let counter = (date.getTime() - Date.now()) / 1000;

			interval = setInterval(() => {
				counter--;

				if (counter < 0) {
					stopTimer();
					let index = roomData.muted.findIndex((perm) => perm.user.id == me.id);
					if (index != -1) {
						roomData.muted.splice(index, 1);
					}
				}
			}, 1000);
		};

		const stopTimer = () => {
			clearInterval(interval);
			interval = 0;
		};

		const checkIfMuted = () => {
			let perm = isMuted(me.id);

			if (perm != undefined) {
				startCountDown(perm.expired_at!);
			}
		};

		const showDate = (date: Date | null) => {
			if (!date) return '';
			let t = new Date(date);
			return t.toLocaleString();
		};

		const messages = computed(() => {
			return roomData.messages.filter(
				(msg) =>
					useFriends().ignored.value.findIndex(
						(user) => user.id == msg.author.id,
					) == -1,
			);
		});

		return {
			roomData,
			message_field,
			messages,
			me,
			cm_user,
			isModerator,
			isMuted,
			onSendMsg,
			onMoreMsg,
			showDate,
		};
	},
	emits: ['close', 'leave'],
});
</script>

<style scoped>
.room-ctn {
	display: flex;
	flex-direction: column;
	flex: 1 0 auto;
}

.content {
	flex-grow: 1;
}

.messages-ctn {
	overflow-y: auto;
	overflow-x: hidden;
	height: 100%;
	max-height: 347px;
	display: flex;
	flex-direction: column-reverse;
	align-items: flex-start;
}

.msg {
	margin: 5px;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.msg--from-me {
	align-self: flex-end;
	align-items: flex-end;
}

.msg__name {
	padding: 4px;
	cursor: default;
}

.msg__content {
	padding: 3px;
	border-radius: 4px;
	background-color: cadetblue;
	text-align: left;
	max-width: 250px;
}

.info {
	align-self: center;
}

.info--clickable {
	cursor: pointer;
}

.bar {
	flex-basis: auto;
	background-color: lightgray;
	border-top: 2px solid black;
	display: flex;
	justify-content: space-between;
}

.bar__input {
	width: 100%;
	display: flex;
}

.input__field {
	width: 80%;
}

.input__btn {
	width: 15%;
	padding: 5px;
	border-left: 2px solid black;
	cursor: pointer;
}

.setting-btn {
	padding: 5px;
	border-right: 2px solid black;
	cursor: pointer;
}

.fa-crown {
	font-size: small;
}
</style>
