import { Module }     from '@nestjs/common';
import { forwardRef } from '@nestjs/common';

import { FriendshipsModule }  from "./friendships/friendships.module";
import { IgnoredsModule } from "./ignoreds/ignoreds.module";

@Module({
	imports: [
		// Modules
		forwardRef(() => FriendshipsModule),
		forwardRef(() => IgnoredsModule),
	],
	controllers: [],
	providers: [],
	exports: []
})
export class RelationsModule {}
