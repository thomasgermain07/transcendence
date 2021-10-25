import {
	Controller,
	UseGuards,
	Post,
	Body,
	BadRequestException,
	NotFoundException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { Get } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Room } from 'src/game/rooms/entities/room.entity';

import { DMService } from '../services/dm.service';
import { DMGateway } from '../gateways/dm.gateway';
import { UsersService } from 'src/users/services/users.service';
import { RoomsService } from 'src/game/rooms/services/rooms.service';
import { PlayersService } from 'src/game/players/services/players.service';
import { InvitationDto } from '../dto/invitation.dto';
import { IgnoredsService } from '../../relations/ignoreds/services/ignoreds.service';

@UseGuards(JwtAuthGuard)
@Controller('dm')
export class DMController {
	constructor(
		private readonly dm_svc: DMService,
		private readonly dm_gtw: DMGateway,
		private readonly users_svc: UsersService,
		private readonly game_rooms_svc: RoomsService,
		private readonly players_svc: PlayersService,
		private readonly ignoreds_svc: IgnoredsService,
	) {}

	@Get('users')
	async findRelatedUsers(@AuthUser() user: User): Promise<User[]> {
		return this.dm_svc.findRelatedUsers(user);
	}

	@Post('send-invitation')
	async sendGameInvite(
		@Body() invitation: InvitationDto,
		@AuthUser() user: User,
	): Promise<InvitationDto> {
		let target: User;
		try {
			target = await this.users_svc.findOne(invitation.guestId);
		} catch (error) {
			throw new BadRequestException('User does not exist');
		}
		const ignored = await this.ignoreds_svc.findOrReverse(user, target);
		if (ignored) {
			throw new UnprocessableEntityException(
				'Cannot send a Duel to a user you are ignoring or who is ignoring you.',
			);
		}

		try {
			await this.users_svc.updateGameInvitation(invitation.host, true);
		} catch (error) {
			throw new BadRequestException('Bad request');
		}

		this.dm_gtw.sendGameInvitation(invitation);

		return invitation;
	}

	@Post('refuse-invitation')
	async refuseGameInvite(@Body() invitation: InvitationDto): Promise<void> {
		if (
			(await this.users_svc.findOne(invitation.host.id))
				.game_invitation_pending === false
		) {
			throw new NotFoundException('Invitation expired');
		}

		this.dm_gtw.answerGameInvitation({
			reply: 'Game Invitation Refused',
			...invitation,
		});

		await this.users_svc.updateGameInvitation(invitation.host, false);
	}

	@Post('cancel-invitation')
	async cancelGameInvite(@AuthUser() user: User): Promise<void> {
		await this.users_svc.updateGameInvitation(user, false);
	}

	@Post('accept-invitation')
	async acceptGameInvite(
		@Body() invitation: InvitationDto,
		@AuthUser() user: User,
	): Promise<Room> {
		const userInGame = await this.players_svc.checkIfInGame(user);
		const hostInGame = await this.players_svc.checkIfInGame(invitation.host);
		if (userInGame || hostInGame) {
			throw new NotFoundException('Invitation expired');
		}

		if (
			(await this.users_svc.findOne(invitation.host.id))
				.game_invitation_pending === false
		) {
			throw new NotFoundException('Invitation expired');
		}

		const room = await this.game_rooms_svc.createPrivate(
			invitation.gameOptions,
		);

		try {
			const guest = await this.users_svc.findOne(invitation.guestId);
			await this.players_svc.create(room, invitation.host);
			await this.players_svc.create(room, guest);
		} catch (error) {
			throw new BadRequestException('User does not exist');
		}

		this.dm_gtw.answerGameInvitation({
			reply: 'Game Invitation Accepted',
			gameRoom: room,
			...invitation,
		});

		await this.users_svc.updateGameInvitation(invitation.host, false);

		return room;
	}
}
