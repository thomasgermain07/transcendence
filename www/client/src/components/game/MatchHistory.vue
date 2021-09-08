<template>
  <div class="match-history">
    <div v-if="loading">LOADING...</div>
    <div v-else>
      <!-- <p>{{ user.id }}</p> -->
      <!-- {{ matchHistory }} -->
      <div class="match" v-for="match in matchHistory" v-bind:key="match.id">
        <div class="players">
          <div class="player-details left">
            <!-- {{ match.room.players[0] }} -->
              <div class="player-info">
                <img class="avatar" :src="match.room.players[0].user.avatar" alt="logo" srcset="">
                <div class="winner-ctn">
                  <p class="username">{{ match.room.players[0].user.name }}</p>
                  <p class="victory" v-if="match.room.players[0].winner">victory</p>
                </div>
                <p class="score">{{ match.room.players[0].score }}</p>
              </div>
          </div>
          <div>-</div>
          <div class="player-details right">
            <!-- {{ match.room.players[1] }} -->
              <div class="player-info">
                <p class="score">{{ match.room.players[1].score }}</p>
                <div class="winner-ctn">
                  <p class="username">{{ match.room.players[1].user.name }}</p>
                  <p class="victory" v-if="match.room.players[1].winner">victory</p>
                </div>
                <img class="avatar" :src="match.room.players[1].user.avatar" alt="logo" srcset="">
              </div>
          </div>
        </div>
        
        <p class="mode">mode: {{ match.room.mode }}</p>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useAxios } from '../../composables/axios'

export default defineComponent({
  name: 'MatchHistory',
  props: ['user'],

  setup(props) {
    const { axios } = useAxios()
    const loading = ref(true)
    const user = ref(props.user)
    const matchHistory = ref([])

    const fetchUserMatchHistory = async () => {
      loading.value = true
      const response = await axios
        .get(`game/players/history/${user.value.id}`)
        .catch((err) => {
          console.log(err)
        })

      if (response) {
        console.log('Fetching match history from user: ' + user.value.id)
        loading.value = false
        matchHistory.value = response.data
      }
    }

    fetchUserMatchHistory()

    watch(
      () => props.user,
      () => {
        user.value = props.user
        fetchUserMatchHistory()
      },
    )

    const test = [ 
      { 
        "id": 7, 
        "room": 
        { 
          "mode": "duel", 
          "state": "over", 
          "players": [ 
            { 
              "position": "left", 
              "score": 2, 
              "winner": false, 
              "user": 
              { 
                "name": "bob", 
                "avatar": null, 
                "ladderLevel": 48 
              } 
            }, 
            { 
              "position": "right", 
              "score": 15, 
              "winner": true, 
              "user": 
              { 
                "name": "karl", 
                "avatar": "http://localhost:8080/api/users/images/map-2df138c8f-388b-455c-bcb8-c62d859d0d25.png", 
                "ladderLevel": 53 
              } 
            } 
          ] 
        } 
      },
    ]
    
    return {
      loading,
      user,
      matchHistory,
    }
  },
})
</script>

<style scoped>

.match {
  border: solid 1px var(--secondary-color);
  color: var(--secondary-color);
  border-radius: 4px;
  /* background-color: #173f5f; */
  /* box-shadow: -1rem 0 1rem rgba(0, 0, 0, 0.568); */
  /* display: flex;
  flex-direction: column; */
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: 0.2s;
  align-items: center;
}

.players {
  display: flex;
  justify-content: space-evenly;
  /* flex-direction: column-reverse; */
}

/* .player {
  flex: 1;
  margin: auto;
} */

.player-details {
  flex: 1;
  margin: auto;
  display: flex;
  flex-direction: column;
}

.player-info {
  display: flex;
  justify-content: space-evenly;
  /* margin: auto; */
  height: 40px;
}

.winner-ctn {
  text-transform: capitalize;
}

.username, .score {
  font-size: 20px;
  font-weight: 800;
}

.victory {
  color: var(--primary-color);
  padding-top: 5px;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.mode {
  text-align: justify;
  padding: 10px;
  padding-bottom: 0;
}
</style>
