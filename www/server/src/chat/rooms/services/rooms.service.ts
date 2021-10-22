import { Injectable }          from '@nestjs/common';
import { InjectRepository }    from '@nestjs/typeorm';
import { Not, In, Repository } from 'typeorm';
import * as bcrypt             from 'bcrypt'

import { User } from 'src/users/entities/user.entity';

import { CreateRoomDto } from '../dto/create-room.dto';
import { UpdateRoomDto } from '../dto/update-room.dto';
import { Room }          from '../entities/room.entity'

@Injectable()
export class RoomsService
{
	constructor(
		@InjectRepository(Room)
		private readonly room_repo: Repository<Room>,
	)
	{

	}

	async create(
		owner: User,
		create_dto: CreateRoomDto,
	)
		: Promise<Room>
	{
		if (create_dto.password)
			create_dto.password = await this.hashSecure(create_dto.password);

		const room: Room = this.room_repo.create(create_dto);
		room.owner = owner;

		return this.room_repo.save(room);
	}

	async findNotIn(
		rooms: Room[],
	)
		: Promise<Room[]>
	{
		return this.room_repo.find({
			where: {
				id: Not(In(rooms.map(room => room.id)))
			}
		});
	}

	async findVisibleNotIn(
		rooms: Room[],
	)
		: Promise<Room[]>
	{
		return this.room_repo.find({
			where: {
				id: Not(In(rooms.map(room => room.id))),
				visible: true,
			}
		});
	}

	async find(
		data: Object,
	)
		: Promise<Room[]>
	{
		return this.room_repo.find(data);
	}

	async findOne(
		data: Object,
	)
		: Promise<Room>
	{
		if (data['id'] === NaN)
			return undefined;

		return this.room_repo.findOne(data);
	}

	async update(
		room: Room,
		update_dto: UpdateRoomDto,
	)
		: Promise<Room>
	{
		if (!update_dto.name)
			delete update_dto.name;

		if (update_dto.password)
			update_dto.password = await this.hashSecure(update_dto.password);

		const room_update: Room = this.room_repo.create(room);
		Object.assign(room_update, update_dto);

		return this.room_repo.save(room_update);
	}

	async remove(
		room: Room,
	)
		: Promise<void>
	{
		this.room_repo.remove(room);
	}

	async verifyPassword(
		room: Room,
		password: string,
	)
		: Promise<boolean>
	{
		if (!room.password)
			return true;

		if (!password)
			return false;

		return this.hashVerify(password, room.password);
	}

	private async hashSecure(
		data: string,
	)
		: Promise<string>
	{
		return bcrypt.hash(data, 10);
	}

	private async hashVerify(
		data: string,
		hashed_data: string,
	)
		: Promise<boolean>
	{
		return bcrypt.compare(data, hashed_data);
	}

}
