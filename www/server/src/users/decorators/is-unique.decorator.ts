import { Injectable } from '@nestjs/common';
import { registerDecorator } from 'class-validator';
import { ValidationOptions } from 'class-validator';
import { ValidationArguments } from 'class-validator';
import { ValidatorConstraint } from 'class-validator';
import { ValidatorConstraintInterface } from 'class-validator';

import { UsersService } from '../services/users.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueUserConstraint implements ValidatorConstraintInterface {
	constructor(private readonly users_svc: UsersService) {}

	async validate(value: any, args: ValidationArguments): Promise<boolean> {
		const [attribute] = args.constraints;

		return !(await this.users_svc.findOne({ [attribute]: value }));
	}

	defaultMessage(args: ValidationArguments): string {
		const [attribute] = args.constraints;

		return `User ${attribute} is already used.`;
	}
}

export function IsUnique(
	attribute: string,
	validationOptions?: ValidationOptions,
) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [attribute],
			validator: IsUniqueUserConstraint,
		});
	};
}
