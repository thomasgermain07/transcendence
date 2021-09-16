import { Injectable } from '@nestjs/common'
import { registerDecorator } from 'class-validator'
import { ValidationOptions } from 'class-validator'
import { ValidationArguments } from 'class-validator'
import { ValidatorConstraint } from 'class-validator'
import { ValidatorConstraintInterface } from 'class-validator'

import { UsersService } from '../services/users.service'

@ValidatorConstraint({ async: true })
@Injectable()
export class ExistsUserConstraint implements ValidatorConstraintInterface {
  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------
  constructor(private readonly users_svc: UsersService) {}

  // -------------------------------------------------------------------------
  // Public methods
  // -------------------------------------------------------------------------
  async validate(value: any, args: ValidationArguments): Promise<boolean> {
		const [attribute] = args.constraints;
		return !!(await this.users_svc.findOne({ [attribute]: value }));
  }

  defaultMessage(args: ValidationArguments): string {
    return `User does not exist.`
  }
}

// -----------------------------------------------------------------------------
// Decorator
// -----------------------------------------------------------------------------
export function Exists(attribute: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [attribute],
      validator: ExistsUserConstraint,
    })
  }
}
