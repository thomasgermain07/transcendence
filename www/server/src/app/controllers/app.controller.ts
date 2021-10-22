import { Req, Controller } from "@nestjs/common";
import { Get }             from "@nestjs/common";

@Controller('')
export class AppController
{
	constructor()
	{

	}

	@Get('csrf')
	async csrf(
		@Req() request: any,
	)
		: Promise<any>
	{
		return { token: request.csrfToken() };
	}

}
