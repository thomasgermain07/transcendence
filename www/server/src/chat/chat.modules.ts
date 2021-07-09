import { Module } from '@nestjs/common';

import { MessageGateway } from './messages.gateway';

@Module({
  providers: [MessageGateway],
})
export class ChatModule {}