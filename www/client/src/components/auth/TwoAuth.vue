<template>
	<div class="google-authenticator">
		<h3>Activate Google Authenticator</h3>
		<div class="switch">
			<input
				id="switch-1"
				type="checkbox"
				class="switch-input"
				v-model="switchTwoFa.state"
			/>
			<label for="switch-1" class="switch-label">Switch</label>
		</div>
		<span v-if="switchTwoFa.state" class="label-active">ACTIVE</span>
		<span v-if="!switchTwoFa.state">DISABLED</span>
		<div class="qrcode" v-bind:class="{ active: switchTwoFa.state }">
			<div v-if="qrcodeActive" class="alert-qrcode-window">
				<alert-message-qrcode v-on:close-alert="closeMessage" />
			</div>
			<img
				v-if="qrcode"
				v-bind:src="qrcode"
				class="qrcode_picture"
				alt="qrcode"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ref, reactive, watch } from 'vue';

import { useAuth } from '@/composables/auth';
import { AxiosResType, AxiosErrType } from '@/composables/axios';
import AlertMessageQrcode from '@/components/edit/AlertMessageQrcode.vue';

export default defineComponent({
	name: 'google-authenticator',
	components: {
		AlertMessageQrcode,
	},
	setup() {
		const messages = ref<string[]>([]);
		const qrcode = ref<string | null>();
		const qrcodeActive = ref(false);
		const { activateTwoFa, deactivateTwoFa, user } = useAuth();

		const switchTwoFa = reactive({
			state: user.isTwoFactorAuthenticationEnabled,
		});

		const closeMessage = (): void => {
			qrcodeActive.value = false;
		};

		watch(
			() => switchTwoFa.state,
			() => {
				if (switchTwoFa.state === true) {
					activateTwoFa()
						.then((response: AxiosResType) => {
							qrcode.value = response.data;
							qrcodeActive.value = true;
						})
						.catch((err: AxiosErrType) => {
							messages.value = err.response?.data.message;
						});
				} else {
					deactivateTwoFa()
						.then(() => {
							qrcode.value = null;
						})
						.catch((err: AxiosErrType) => {
							messages.value = err.response?.data.message;
						});
				}
			},
		);

		return {
			qrcode,
			qrcodeActive,
			switchTwoFa,
			closeMessage,
		};
	},
});
</script>

<style scoped>
h3 {
	padding-bottom: 1rem;
}

.label-active {
	color: green;
}
.qrcode {
	display: none;
}
.qrcode.active {
	display: block;
}
.qrcode_picture {
	width: 250px;
	height: 250px;
}
/* Power Ups Switch button */
.switch {
	position: relative;
	display: inline-block;
	margin: 20px;
}
.switch-input {
	display: none;
}
.switch-label {
	display: block;
	width: 48px;
	height: 24px;
	text-indent: -150%;
	clip: rect(0 0 0 0);
	color: transparent;
	user-select: none;
}
.switch-label::before,
.switch-label::after {
	content: '';
	display: block;
	position: absolute;
	cursor: pointer;
}
.switch-label::before {
	width: 100%;
	height: 100%;
	background-color: #dedede;
	border-radius: 9999em;
	-webkit-transition: background-color 0.25s ease;
	transition: background-color 0.25s ease;
}
.switch-label::after {
	top: 0;
	left: 0;
	width: 24px;
	height: 24px;
	border-radius: 50%;
	background-color: #fff;
	box-shadow: 0 0 2px rgba(0, 0, 0, 0.45);
	-webkit-transition: left 0.25s ease;
	transition: left 0.25s ease;
}
.switch-input:checked + .switch-label::before {
	background-color: green;
}
.switch-input:checked + .switch-label::after {
	left: 24px;
}
.alert-qrcode-window {
	position: fixed;
	top: 50%;
	left: 50%;
	width: 20vw;
	height: 20vh;
	max-width: 800px;
	max-height: 100%;
	padding: 50px 50px 50px 50px;
	transform: translate(-50%, -50%);
	overflow: scroll;
	line-height: 130%;
	box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.9);
	border-radius: 2px;
	z-index: 100;
	text-align: center;
	font-family: Helvetica, Arial, sans-serif;
	align-items: center;
	filter: drop-shadow(0 0 8px #070707);
	border: 1px solid rgba(241, 142, 6, 0.81);
	background-color: rgba(220, 128, 1, 0.16);
	box-shadow: 0px 0px 2px #ffb103;
	color: #ffb103;
	text-shadow: 2px 1px #00040a;
	transition: 0.5s;
	cursor: pointer;
	background: #303133;
}
</style>
