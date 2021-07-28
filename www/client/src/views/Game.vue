<template>
  <div class="game">
    <h1>Game View</h1>
    <div class="game-cards">
      <article class="card">
        <Card>
          <template v-slot:default="slotProps">
            <header>
              <h2>{{ slotProps.duelTitle }}</h2>
            </header>
            <div class="rules">
              <p>{{ slotProps.duelRules }}</p>
              <router-link v-bind:to="'/game/duel'" class="link-button">
                {{ slotProps.duelButton }}
              </router-link>
            </div>
          </template>
        </Card>
      </article>
      <article class="card">
        <Card>
          <template v-slot:default="slotProps">
            <header>
              <h2>{{ slotProps.ladderTitle }}</h2>
            </header>
            <div class="rules">
              <p>{{ slotProps.ladderRules }}</p>
              <router-link v-bind:to="'/game/ladder'" class="link-button">
                {{ slotProps.ladderButton }}
              </router-link>
            </div>
          </template>
        </Card>
      </article>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Card from '../components/Game/Card.vue'

export default defineComponent({
  name: 'Game',
  components: { Card },

  setup() {
    return
  },
})
</script>

<style>
.link-button {
  display: block;
  background: #0a0a0a;
  border: none;
  margin: 20px auto 0;
  padding: 0.7em;
  color: #f1f1f1;
  text-decoration: none;
}
.link-button:hover {
  background: #aa6bdd;
}

.game-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  grid-gap: 20px;
  max-width: 800px;
  margin: 1em auto;
}

.card {
  display: grid;
  grid-template-rows: max-content 200px 1fr;
  border: 1px solid #999;
  border-radius: 3px;
}
.card h2 {
  margin: 0;
  padding: 0.5rem;
}

.card .rules {
  padding: 0.5rem;
}
</style>
