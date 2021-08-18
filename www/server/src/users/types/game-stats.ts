
export type GameStatsPerMode = {
	duel: {
		wins: number,
		losses: number,
	}
	ladder: {
		wins: number,
		losses: number,
	}
}

export type GameStatsTotal = {
	total_wins: number,
	total_losses: number,
    total_played: number,
}