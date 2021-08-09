import { Req, Controller } from "@nestjs/common";
import { Get }             from "@nestjs/common";

@Controller('')
export class AppController
{
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor()
	{

	}

	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
	@Get('csrf')
	async csrf(
		@Req() request: any,
	)
		: Promise<any>
	{
		return { token: request.csrfToken() };
	}

}
