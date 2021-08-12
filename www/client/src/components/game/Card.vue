<template>
  <div class="card-game">
    <header>
      <slot name="header">Default Title</slot>
    </header>
    <div class="rules">
      <slot name="rules">Default Rules</slot>
    </div>
    <div>
      <slot name="button">Default Button</slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Card',

  setup() {
    return
  },
})
</script>

<style scoped>
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
  padding: 0.5rem;
}

.rules {
  padding: 0.5rem;
  font-size: 200%;
  font-weight: bold;
  color: #000000;
}
</style>
