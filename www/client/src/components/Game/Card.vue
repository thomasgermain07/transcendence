<template>
		<!-- <article class="card"> -->
			<header>
				<slot name="header">Default Title</slot>
			</header>
			<div class="rules">
				<slot name="rules">Default Rules</slot>
			</div>
			<div>
				<slot name="button">Default Button</slot>
			</div>
		<!-- </article> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'Card',

  setup() {

		return ;
  },
})
</script>

<style>

/* .link-button {
  display: block;
  background: #0a0a0a;
  border: none;
  margin: 20px 5px 10px;
  padding: 0.7em;
  color: #f1f1f1;
  text-decoration: none;
	border-radius: 40px;
}
.link-button:hover {
  background: #aa6bdd;
} */


.card h2 {
  margin: 0;
  padding: .5rem;
}

.rules {
  padding: .5rem;
	font-size: 200%;
	font-weight: bold;
	color: #000000;
}

</style>
