import { registerDecorator }            from "class-validator";
import { ValidationOptions }            from "class-validator";
import { ValidationArguments }          from "class-validator";
import { ValidatorConstraint }          from "class-validator";
import { ValidatorConstraintInterface } from "class-validator";

import { PermissionType } from "../entities/permission.entity";

@ValidatorConstraint({ async: true })
class IsValidPermissionTypeConstraint
	implements ValidatorConstraintInterface
{

	validate(
		type: string
	)
		: boolean
	{
		return (Object.values(PermissionType) as string[]).includes(type);
	}

	defaultMessage(
		args: ValidationArguments
	)
		: string
	{
		return `Invalid permission type.`;
	}

}

export function IsValidType(
	validationOptions?: ValidationOptions
)
{
	return function (
		object: Object,
		propertyName: string
	)
	{
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsValidPermissionTypeConstraint,
		});
	};
}
