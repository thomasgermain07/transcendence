import {
    Connection,
    EntitySubscriberInterface,
    EventSubscriber,
		InsertEvent,
		RemoveEvent,
		UpdateEvent,
  } from 'typeorm';
  
  import { Room } from '../entities/room.entity';
  import { RoomsService } from '../services/rooms.service';
	import { Player } from 'src/game/players/entities/player.entity';
	import { UsersService, Achievements } from 'src/users/services/users.service';
	import { DifficultyLevel } from '../../enum/enum';


    
  @EventSubscriber()
  export class RoomsSubscriber implements EntitySubscriberInterface<Room> {
    constructor(
      connection: Connection,
			private readonly roomsService: RoomsService,
			private readonly usersService: UsersService,

    ) {
      connection.subscribers.push(this);
    }
  
    listenTo() {
      return Room;
		}
		
		async afterUpdate(event: UpdateEvent<Room>) {
			console.log("---------__AFTER UPDATE ROOM-------------")
			console.log(event.entity);
			let player: Player = null;
			const room: Room = await this.roomsService.findOne(event.entity.id);

			console.log(room);

			if (event.entity.state && event.entity.state == "over") {
				player = await this.defenseAchievements(room, player)
				console.log(player);

				await this.difficultyAchievements(player)
			
				await this.winneAcchivements(player);

				await this.allTerrainAchievements(player)

				await this.doneAchievments(player)
			}
		}
		
		private async defenseAchievements(room: Room, player: Player): Promise<Player> {

			if (room.players[0].winner) {
				player = room.players[0];
				if  (room.players[1].score == 0) {
					await this.usersService.updateAchievements(player.user, Achievements.DEFENSE_MASTER) 
				}
			}
			else {
				player = room.players[1];
				if  (room.players[0].score == 0) {
					await this.usersService.updateAchievements(player.user, Achievements.DEFENSE_MASTER) 
				}
			}
			console.log("---------------------DEFENSE ACHIEVEMENTS-------------")
			console.log(player)
			return player
		}

		private	async difficultyAchievements(player: Player): Promise<void> {
			const room: Room = await this.roomsService.findOneByPlayerId(player.id)
			if (room.option.difficulty == DifficultyLevel.MEDIUM) {
				await this.usersService.updateAchievements(player.user, Achievements.MIDDLE_PLAYER)
			}
			else if (room.option.difficulty == DifficultyLevel.HARD) {
				await this.usersService.updateAchievements(player.user, Achievements.HARD_MASTER)
			}
		}

		private async winneAcchivements(player: Player): Promise<void> {
			const rooms: Room[] = await this.roomsService.findAllWinneByUser(player.user);
			switch (rooms.length) {
				case 10:
					await this.usersService.updateAchievements(player.user, Achievements.TEN_WINNE)
				break;

				case 30:
					await this.usersService.updateAchievements(player.user, Achievements.THIRTY_WINNE)
				break;

				case 70:
					await this.usersService.updateAchievements(player.user, Achievements.SEVENTY_WINNE)
				break;

				case 100:
					await this.usersService.updateAchievements(player.user, Achievements.HUNDRED_WINNE)
				break;
				
				case 200:
					await this.usersService.updateAchievements(player.user, Achievements.TWO_HUNDRED_WINNE)
				break
			}
		}

		private async allTerrainAchievements(player: Player): Promise<void> {
			const achieved = await this.roomsService.findWinneByUserInMapDuel(player.user)
			if (achieved) {
				await this.usersService.updateAchievements(player.user, Achievements.ALL_TERRAIN)
			}
		}

		private async doneAchievments(player: Player): Promise<void> {
			if (player.user.achievements.length == 11) (
				await this.usersService.updateAchievements(player.user, Achievements.DONE)
			)
		}
  
  }