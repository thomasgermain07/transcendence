import { Injectable }       from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository }       from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Room } from 'src/chat/rooms/entities/room.entity';

import { CreatePermissionDto }        from '../dto/create-permission.dto';
import { Permission, PermissionType } from '../entities/permission.entity';

@Injectable()
export class PermissionsService
{
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		@InjectRepository(Permission)
		private readonly permission_repo: Repository<Permission>,
	)
	{

	}

	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
	async create(
		user: User,
		room: Room,
		create_dto: CreatePermissionDto,
	)
		: Promise<Permission>
	{
		const permission: Permission = this.permission_repo.create();
		permission.room = room;
		permission.user = user;
		permission.type = PermissionType[create_dto.type.toUpperCase()];
		permission.expired_at = create_dto.expired_at;

		return this.permission_repo.save(permission);
	}

	async findOne(
		data: Object,
	)
		: Promise<Permission>
	{
		return this.permission_repo.findOne(data);
	}

	async remove(
		user: User,
		room: Room,
	)
		: Promise<void>
	{
		this.permission_repo.delete({
			user: user,
			room: room,
		});
	}

}
