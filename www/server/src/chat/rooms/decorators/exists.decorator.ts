import { Injectable }                   from "@nestjs/common";
import { registerDecorator }            from "class-validator";
import { ValidationOptions }            from "class-validator";
import { ValidationArguments }          from "class-validator";
import { ValidatorConstraint }          from "class-validator";
import { ValidatorConstraintInterface } from "class-validator";

import { RoomsService } from "../services/rooms.service";

@ValidatorConstraint({ async: true })
@Injectable()
export class ExistsRoomConstraint
	implements ValidatorConstraintInterface
{

	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		private readonly rooms_svc: RoomsService,
	)
	{

	}

	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
	async validate(
		id: number,
	)
		: Promise<boolean>
	{
		return !!(await this.rooms_svc.findOne({ id: id }));
	}

	defaultMessage(
		args: ValidationArguments,
	)
		: string
	{
		return "Room does not exist.";
	}

}

// -----------------------------------------------------------------------------
// Decorator
// -----------------------------------------------------------------------------
export function Exists(
	validationOptions?: ValidationOptions,
)
{
	return function (
		object: Object,
		propertyName: string,
	)
	{
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: ExistsRoomConstraint,
		});
	};
}
