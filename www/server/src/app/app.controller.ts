import { Logger, Controller, Get, Post, Request, UseGuards} from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
    constructor(private readonly authService: AuthService) {}
    private readonly logger = new Logger(AppController.name)

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Request() req) {
        this.logger.log("HEEEEEEEEEER");
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}