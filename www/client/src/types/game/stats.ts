export type StatsType = {
	user_id: number;
	duel: {
		wins: number;
		losses: number;
	};
	ladder: {
		wins: number;
		losses: number;
	};
	total_wins: number;
	total_losses: number;
	total_played: number;
};
