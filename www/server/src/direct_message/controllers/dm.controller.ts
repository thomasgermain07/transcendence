import {
  Controller,
  UseGuards,
  Post,
  Body,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { Get } from '@nestjs/common'

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { AuthUser } from 'src/auth/decorators/auth-user.decorator'
import { User } from 'src/users/entities/user.entity'
import { Room } from 'src/game/rooms/entities/room.entity'

import { DMService } from '../services/dm.service'
import { DMGateway } from '../gateways/dm.gateway'
import { UsersService } from 'src/users/services/users.service'
import { RoomsService } from 'src/game/rooms/services/rooms.service'
import { PlayersService } from 'src/game/players/services/players.service'
import { InvitationDto } from '../dto/invitation.dto'

@UseGuards(JwtAuthGuard)
@Controller('dm')
export class DMController {
  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------
  constructor(
    private readonly dm_svc: DMService,
    private readonly dm_gtw: DMGateway,
    private readonly users_svc: UsersService,
    private readonly game_rooms_svc: RoomsService,
    private readonly players_svc: PlayersService,
  ) {}

  // -------------------------------------------------------------------------
  // Public methods
  // -------------------------------------------------------------------------
  @Get('users')
  async findRelatedUsers(@AuthUser() user: User): Promise<User[]> {
    return this.dm_svc.findRelatedUsers(user)
  }

  @Post('send-invitation')
  async sendGameInvite(
    @Body() invitation: InvitationDto,
    @AuthUser() user: User,
  ): Promise<InvitationDto> {
    // Change game_invitation_pending of the host user to true
    try {
      await this.users_svc.updateGameInvitation(invitation.host, true)
    } catch (error) {
      throw new BadRequestException('Bad request')
    }

    // Send invite notification to guest
    this.dm_gtw.sendGameInvitation(invitation)

    return invitation
  }

  @Post('refuse-invitation')
  async refuseGameInvite(@Body() invitation: InvitationDto): Promise<void> {
    // Check if invitation has expired
    if (
      (await this.users_svc.findOne(invitation.host.id))
        .game_invitation_pending === false
    ) {
      throw new NotFoundException('Invitation expired')
    }

    // Send answer notification to host
    this.dm_gtw.answerGameInvitation({
      reply: 'Game Invitation Refused',
      ...invitation,
    })

    // Switch game_invitation_pending of the host user back to false
    await this.users_svc.updateGameInvitation(invitation.host, false)
  }

  @Post('cancel-invitation')
  async cancelGameInvite(@AuthUser() user: User): Promise<void> {
    // Switch game_invitation_pending of the host user back to false
    await this.users_svc.updateGameInvitation(user, false)
  }

  @Post('accept-invitation')
  async acceptGameInvite(
    @Body() invitation: InvitationDto,
    @AuthUser() user: User,
  ): Promise<Room> {
    // Check if users from invitation are already in a game room
    const userInGame = await this.players_svc.checkIfInGame(user)
    const hostInGame = await this.players_svc.checkIfInGame(invitation.host)
    if (userInGame || hostInGame) {
      throw new NotFoundException('Invitation expired')
    }

    // Check if invitation has expired
    if (
      (await this.users_svc.findOne(invitation.host.id))
        .game_invitation_pending === false
    ) {
      throw new NotFoundException('Invitation expired')
    }

    // create game room
    const room = await this.game_rooms_svc.createPrivate(invitation.gameOptions)

    // add both players
    try {
      const guest = await this.users_svc.findOne(invitation.guestId)
      await this.players_svc.create(room, invitation.host)
      await this.players_svc.create(room, guest)
    } catch (error) {
      console.log(error)
      throw new BadRequestException('User does not exist')
    }

    // Send answer notification to host
    this.dm_gtw.answerGameInvitation({
      reply: 'Game Invitation Accepted',
      gameRoom: room,
      ...invitation,
    })

    // Switch game_invitation_pending of the host user back to false
    await this.users_svc.updateGameInvitation(invitation.host, false)

    return room
  }
}
