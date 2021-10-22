import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { User } from 'src/users/entities/user.entity'

import { CreateMessageDto } from '../dto/create-message.dto'
import { Message } from '../entities/message.entity'

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messages_repo: Repository<Message>,
  ) {}

  create(
    author: User,
    target: User,
    create_dto: CreateMessageDto,
  ): Promise<Message> {
    const message: Message = this.messages_repo.create()
    message.author = author
    message.target = target
    message.content = create_dto.content

    return this.messages_repo.save(message)
  }

  findAll(user: User, target: User, page: number): Promise<Message[]> {
    const PAGE_SIZE: number = 50

    return this.messages_repo.find({
      where: [
        { author: user, target: target },
        { author: target, target: user },
      ],
      order: { id: 'DESC' },
      take: PAGE_SIZE,
      skip: page <= 1 ? 0 : PAGE_SIZE * (page - 1),
    })
  }
}
