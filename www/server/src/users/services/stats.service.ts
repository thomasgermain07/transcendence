import { Injectable }           from '@nestjs/common'
import { InjectRepository }     from '@nestjs/typeorm'
import { Repository }           from 'typeorm'

import { User }                               from '../entities/user.entity'
import { GameLeaderboard }                    from '../types/game-leaderboard'
import { GameStatsPerMode, GameStatsTotal }   from '../types/game-stats'


@Injectable()
export class StatsService
{
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	)
	{

	}

	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------

	public async getLeaderboard(
        offset?: number,
        limit?: number,
    ): Promise<GameLeaderboard> {

		const leaderboard = await this.usersRepository
			.createQueryBuilder('user')
			.select(['user.name', 'user.ladderLevel', 'user.avatar'])
			.addSelect('ROW_NUMBER () OVER (ORDER BY "ladderLevel" DESC) as "rank"')
			.offset(offset)
			.limit(limit)
			.getRawMany()
		
        leaderboard.forEach((user: any) => {
            user.rank = parseInt(user.rank)
        });

		return leaderboard as any as GameLeaderboard
	}

	public async getStatsByUser(
		userId : number
	)
		: Promise<GameStatsPerMode & GameStatsTotal>
	{
		const stats_per_mode = await this.getStatsPerMode(userId)

		const stats_total = await this.getTotalStatsByUser(userId)

		return {
			...stats_per_mode,
			...stats_total,
		}
	}


	// -------------------------------------------------------------------------
	// Private methods
	// -------------------------------------------------------------------------
	
	private async getStatsPerMode(
		userId : number
	)
		: Promise<GameStatsPerMode>
	{
		const userStats = await this.usersRepository
		.createQueryBuilder('user')
		.leftJoin('user.players', 'player')
		.leftJoin('player.room', 'room')
		.select([
			 "player.winner AS winner",
			 "room.mode AS game_mode",
			 "count(*) AS total"
		 ])
		.where("user.id =:id", { id: userId })
		.andWhere("player.winner IS NOT NULL")
		.groupBy('room.mode, player.winner, user.id')
		.getRawMany()

		return this.groupByMode(userStats)
	}

	private groupByMode(statsPerModeRaw: any) {

        const rawToObject = statsPerModeRaw.reduce((acc, arr) => {
			acc[arr.game_mode] = acc[arr.game_mode] || {};
			const label = arr.winner === true ? 'wins' : 'losses';
			acc[arr.game_mode][label] = parseInt(arr.total);
			return acc;
		}, {})

        const ret: GameStatsPerMode = {
            duel: {
                wins: rawToObject?.duel?.wins ?? 0,
                losses: rawToObject?.duel?.losses ?? 0,
            },
            ladder: {
                wins: rawToObject?.ladder?.wins ?? 0,
                losses: rawToObject?.ladder?.losses ?? 0,
            }
        }

        return ret
	}

	private async getTotalStatsByUser(
		userId: number
	)
		: Promise<GameStatsTotal>
	{
		const [{wins, losses, played}] = await this.usersRepository
		.createQueryBuilder('user')
		.select([
			'COUNT(*) FILTER (WHERE player.winner = TRUE) as wins',
			'COUNT(*) FILTER (WHERE player.winner = FALSE) as losses',
			'COUNT(*) FILTER (WHERE player.winner IS NOT NULL) as played',
		])
		.leftJoin('user.players', 'player')
		.where('user.id = :id', { id : userId })
		.getRawMany()

		const total: GameStatsTotal = {
			total_wins: parseInt(wins),
			total_losses: parseInt(losses),
			total_played: parseInt(played),
		}

		return total
	}
}