<template>
	<div
		class="
			alert-message-qrcode
			start-icon
			fa fa-exclamation-triangle
			faa-flash
			animated
		"
	>
		<h2 class="title">ALERT</h2>
		<p class="warning">
			Be careful this Qrcode is only generated once. Don't forget to scan it on
			your Google App!
		</p>
		<button @click="closeAlert">Close</button>
	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'alert-message-qrcode',
	emit: ['close-alert'],
	setup(props, context) {
		const closeAlert = () => {
			context.emit('close-alert');
		};

		return {
			closeAlert,
		};
	},
});
</script>

<style scoped>
.alert-message-qrcode .title {
	display: inline-block;
	padding: 0.5em 2em;
	font-weight: bold;
	letter-spacing: 0.1em;
	text-transform: uppercase;
}
.alert-message-qrcode .warning {
	color: #ffb40b;
	padding: 1em;
	margin: 0;
	display: block;
	line-height: 1.4em;

	max-height: 10em;
	align-items: center;
	padding-bottom: 2em;
}
</style>
