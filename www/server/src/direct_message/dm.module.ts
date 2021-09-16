import { Module } from "@nestjs/common";

import { UsersModule }    from "src/users/users.module";

import { MessagesModule } from "./messages/messages.module";
import { DMGateway }      from "./gateways/dm.gateway";
import { DMService }      from "./services/dm.service";
import { DMController }   from "./controllers/dm.controller";

@Module({
	imports: [
		// Modules
		UsersModule,
		MessagesModule,
	],
	controllers: [
		DMController,
	],
	providers: [
		// Services
		DMService,
		// Gateways
		DMGateway,
	],
	exports: [
		// Services
		DMService,
		// Gateways
		DMGateway,
	]
})
export class DMModule {}
