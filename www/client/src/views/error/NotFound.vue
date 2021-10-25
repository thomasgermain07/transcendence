<template>
	<div class="error-not-found">
		<div class="description">
			<h1>Whooops!</h1>
			<p>Sorry, the page you are looking for does not exist</p>
			<router-link :to="{ name: 'index' }">Back to Homepage</router-link>
		</div>

		<div class="illustration">
			<img src="../../assets/images/404.png" alt="" srcset="" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'not-found',

	setup() {},
});
</script>

<style scoped>
.error-not-found {
	padding: 50px;
	display: flex;
	align-content: center;
	align-items: center;
	height: 75vh;
}
@media (max-width: 900px) {
	.error-not-found {
		flex-direction: column;
	}
}

.description h1 {
	padding: 0 50px;
	font-size: 64px;
	font-weight: 800;
}
.description p {
	padding: 1rem;
	margin: 0 0 2rem;
}
.illustration img {
	width: 100%;
}

a {
	padding: 10px;
	text-decoration: none;
	text-transform: uppercase;
	border: 1px solid;
	font-size: 12px;
	font-weight: 800;
	letter-spacing: 1px;
}
a:hover {
	color: white;
	background-color: var(--tertiary-color);
}
</style>
