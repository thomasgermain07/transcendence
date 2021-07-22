<template>
  <div class="watch">
    <div class="watch-duel">
      <h3>Duel Stream</h3>
			<div class="duel-stream" v-if="duelRooms.length > 0">
				<div class="duel-info" v-for="duel in duelRooms" v-bind:key="duel.id">
						<p> DUEL: {{ duel.players[0].user.name }} VS {{ duel.players[1].user.name }}</p>
							<button @click="onWatch(duel.id)">Watch Game</button>
				</div>
			</div>
      <div v-else>No Duel To Watch</div>
    </div>
    <div class="watch-ladder">
      <h3>Ladder Stream</h3>
      <div class="ladder-stream" v-if="ladderRooms.length > 0">
				<div class="ladder-info" v-for="ladder in ladderRooms" v-bind:key="ladder.id">
					<p>LADDER: {{ ladder.players[0].user.name }} VS {{ ladder.players[1].user.name }}</p>
						<button @click="onWatch(ladder.id)">Watch Game</button>
				</div>
			</div>
      <div v-else>No Ladder To Watch</div>
  	</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue'
import { GameState, Room } from '../types/game/gameRoom'
import { useRouter } from 'vue-router'


export default defineComponent({
  name: 'WatchRooms',
  props: ['rooms'],

  setup(props) {
		let itemRefsDuel = []
		let itemRefsLadder = []
		const router = useRouter()


    const duelRooms = computed(() => {
			for (let key in props.rooms) {
				if (props.rooms[key].mode == 'duel') {
					itemRefsDuel.push(props.rooms[key])
				}
			}
			console.log(itemRefsDuel);
			return itemRefsDuel
    })

    const ladderRooms = computed(() => {
			for (let key in props.rooms) {
				if (props.rooms[key].mode == 'ladder') {
					itemRefsLadder.push(props.rooms[key])
				}
			}
			return itemRefsLadder
		})
		
		const onWatch = (roomId: number): void => {
			console.log(roomId);
			router.push(`/game/room/${roomId}`)
		}

		watch(() => props.rooms, () => {
			itemRefsDuel = []
			itemRefsLadder = []
			
		})

	

    return {
      duelRooms,
			ladderRooms,
			onWatch,
    }
  },
})
</script>

<style>

.duel-info {
  flex: auto;
	font-size: 1.4rem;
	text-align: center;
}
button {
  display: block;
  background: #a03939;
  border: none;
  margin: 20px auto 0;
  padding: 1em;
  color: #862f2f;
}

.ladder-info {
  flex: auto;
	font-size: 1.4rem;
	text-align: center;
}
</style>