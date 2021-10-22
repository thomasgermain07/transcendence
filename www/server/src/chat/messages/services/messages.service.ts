import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Room } from 'src/chat/rooms/entities/room.entity';
import { User } from 'src/users/entities/user.entity';

import { CreateMessageDto } from '../dto/create-message.dto';
import { Message } from '../entities/message.entity';

@Injectable()
export class MessagesService {
	constructor(
		@InjectRepository(Message)
		private readonly messages_repo: Repository<Message>,
	) {}

	create(
		author: User,
		room: Room,
		create_dto: CreateMessageDto,
	): Promise<Message> {
		const message: Message = this.messages_repo.create();
		message.author = author;
		message.room = room;
		message.content = create_dto.content;

		return this.messages_repo.save(message);
	}

	findAll(room: Room, page: number): Promise<Message[]> {
		const PAGE_SIZE: number = 50;

		return this.messages_repo.find({
			where: { room: room },
			order: { id: 'DESC' },
			take: PAGE_SIZE,
			skip: page <= 1 ? 0 : PAGE_SIZE * (page - 1),
		});
	}
}
