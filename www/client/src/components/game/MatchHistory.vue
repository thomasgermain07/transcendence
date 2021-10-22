<template>
	<div class="match-history">
		<div v-if="loading">LOADING...</div>
		<div v-else>
			<div class="container">
				<div class="card" v-for="match in matchHistory" v-bind:key="match.id">
					<div class="card_title">
						<div v-if="userIsWinner(match.room.players)">
							<p class="victory">VICTORY</p>
						</div>
						<div v-else>
							<p class="defeat">DEFEAT</p>
						</div>
					</div>
					<div class="match_info">
						<div class="team_name">
							<div class="team1">
								<img
									class="avatar"
									:src="match.room.players[0].user.avatar"
									alt="logo"
									srcset=""
								/>
								<h3>{{ match.room.players[0].user.name.slice(0, 5) }}</h3>
								<h3 class="score">{{ match.room.players[0].score }}</h3>
							</div>
							<div class="team2">
								<img
									class="avatar"
									:src="match.room.players[1].user.avatar"
									alt="logo"
									srcset=""
								/>
								<h3>{{ match.room.players[1].user.name.slice(0, 5) }}</h3>
								<h3 class="score">{{ match.room.players[1].score }}</h3>
							</div>
						</div>
					</div>
					<div class="card_title">
						<p class="mode">Mode: {{ match.room.mode }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { AxiosErrType, useAxios } from '../../composables/axios';
import { Player } from '../../types/game/player';

export default defineComponent({
	name: 'MatchHistory',
	props: ['user'],

	setup(props) {
		const { axios } = useAxios();
		const loading = ref(true);
		const user = ref(props.user);
		const matchHistory = ref<Player[]>([]);

		const fetchUserMatchHistory = async (): Promise<void> => {
			loading.value = true;
			const response = await axios
				.get(`game/players/history/${user.value.id}`)
				.catch((err: AxiosErrType) => {});

			if (response) {
				loading.value = false;
				matchHistory.value = response.data;
			}
		};

		const userIsWinner = (players: Player[]): boolean | null | undefined => {
			const player = players.find(
				(player) => player.user.name === user.value.name,
			);
			return player?.winner;
		};

		fetchUserMatchHistory();

		watch(
			() => props.user,
			() => {
				user.value = props.user;
				fetchUserMatchHistory();
			},
		);

		return {
			loading,
			user,
			matchHistory,
			userIsWinner,
		};
	},
});
</script>

<style scoped>
* {
	padding: 0;
	margin: 0;
	box-sizing: border-box;
}

.container {
	width: 100%;
	display: flex;
	color: var(--tertiary-color);
	overflow: scroll;
}
.card {
	background-color: #fff;
	width: 250px;
	height: 180px;
	box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
	border-radius: 4px;
	padding: 10px;
	margin: 20px;
}
.match_info {
	display: flex;
	justify-content: start;
	padding: 5px 10px;
}

.card_title,
.mode {
	text-align: right;
	padding: 5px 10px;
}

.team1,
.team2 {
	display: flex;
	align-items: center;
}

.avatar {
	height: 40px;
	width: 40px;
	border-radius: 50%;
	margin-bottom: 10px;
}

.team1 h3,
.team2 h3 {
	width: 130px;
	text-transform: uppercase;
	text-align: left;
	padding-left: 20px;
}

.defeat {
	color: red;
}

.victory {
	color: green;
}
</style>
