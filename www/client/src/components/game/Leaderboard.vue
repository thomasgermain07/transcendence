<template>
  <div class="leaderboard">
    <h1>LEADERBOARD</h1>
    <div v-if="loading">LOADING...</div>
    <div v-else>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Avatar</th>
            <th>Username</th>
            <th>Ladder Level</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="user"
            v-for="user in leaderboard"
            v-bind:key="user.rank"
            @click="goToProfile(user.user_id)"
          >
            <td data-title="Rank">{{ user.rank }}</td>
            <td data-title="Avatar">
              <img :src="user.user_avatar" alt="avatar" class="avatar-logo" />
            </td>
            <td data-title="Username">{{ user.user_name }}</td>
            <td data-title="Ladder Level">{{ user.user_ladderLevel }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table-nav">
      <button v-if="offset > 0" @click="prev">prev</button>
      <button v-if="leaderboard.length == limit" @click="next">next ></button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { AxiosErrType, useAxios } from '../../composables/axios'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Leaderboard',

  setup() {
    const { axios } = useAxios()
    const router = useRouter()
    const loading = ref(true)
    const leaderboard = ref([])
    const offset = ref(0)
    const limit = 5

    const fetchLeaderboard = async () => {
      loading.value = true
      const response = await axios
        .get(`users/leaderboard?offset=${offset.value}&limit=${limit}`)
        .catch((err: AxiosErrType) => {
          console.log(err.response?.data)
        })

      if (response) {
        loading.value = false
        leaderboard.value = response.data
      }
    }

    const prev = () => {
      if (offset.value - limit >= 0) {
        offset.value -= limit
      }
      fetchLeaderboard()
    }

    const next = () => {
      offset.value += limit
      fetchLeaderboard()
    }

    fetchLeaderboard()

    const goToProfile = (id: number) => {
      router.push(`/users/${id}/profile`)
    }

    return {
      loading,
      leaderboard,
      prev,
      next,
      offset,
      limit,
      goToProfile,
    }
  },
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@200;400&display=swap');

* {
  box-sizing: border-box;
  font-family: 'Inconsolata', monospace;
}

body {
  background-color: #f9f9f9;
}

h1 {
  font-size: 40px;
  font-weight: 800;
  letter-spacing: -1px;
  padding: 20px;
}

table {
  border-collapse: collapse;
  text-align: left;
  width: 100%;
  margin-bottom: 30px;
}
table thead {
  font-weight: 800;
}
table tr {
  background: white;
  border-bottom: 1px solid;
  text-transform: capitalize;
}

table tbody tr:nth-of-type(odd) {
  background-color: rgba(105, 105, 105, 0.205);
}

table th,
table td {
  padding: 10px 20px;
}

@media (max-width: 800px) {
  table thead {
    left: -9999px;
    position: absolute;
    visibility: hidden;
  }
  table tr {
    border-bottom: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 40px;
  }
  table td {
    border: 1px solid;
    margin: 0 -1px -1px 0;
    padding-top: 35px;
    position: relative;
    width: 50%;
  }
  td:before {
    content: attr(data-title);
    display: block;
    background: #eee;
    color: dimgrey;
    font-size: 10px;
    font-weight: bold;
    padding: 5px;
    position: absolute;
    text-transform: uppercase;
    top: 0;
    left: 0;
  }
  table tbody tr:nth-of-type(odd) {
    background-color: white;
  }
}

.avatar-logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.table-nav button {
  border-radius: 10%;
  margin: 0 10px;
  font-weight: 800;
}

.user {
  cursor: pointer;
}
</style>
