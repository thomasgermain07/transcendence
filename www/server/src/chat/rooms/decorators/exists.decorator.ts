import { Injectable } from '@nestjs/common'
import { registerDecorator } from 'class-validator'
import { ValidationOptions } from 'class-validator'
import { ValidationArguments } from 'class-validator'
import { ValidatorConstraint } from 'class-validator'
import { ValidatorConstraintInterface } from 'class-validator'

import { RoomsService } from '../services/rooms.service'

@ValidatorConstraint({ async: true })
@Injectable()
export class ExistsRoomConstraint implements ValidatorConstraintInterface {
  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------
  constructor(private readonly rooms_svc: RoomsService) {}

  // -------------------------------------------------------------------------
  // Public methods
  // -------------------------------------------------------------------------
  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [attribute] = args.constraints

    return !!(await this.rooms_svc.findOne({ [attribute]: value }))
  }

  defaultMessage(args: ValidationArguments): string {
    const [attribute] = args.constraints

    return `Room ${attribute} does not exists.`
  }
}

// -----------------------------------------------------------------------------
// Decorator
// -----------------------------------------------------------------------------
export function Exists(
  attribute: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [attribute],
      validator: ExistsRoomConstraint,
    })
  }
}
