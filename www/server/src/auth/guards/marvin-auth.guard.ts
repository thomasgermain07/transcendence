import {
    BadRequestException,
    ExecutionContext,
    Injectable,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export default class MarvinAuthGuard extends AuthGuard('marvin') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }

  handleRequest(err, user) {
    if (err || !user) {
      // console.log('in handle request ERROR')
      throw new BadRequestException()
    }
    return user
  }
}