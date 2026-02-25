import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { UserService } from "./user.service";
import { JwtPayload } from "../auth/interfaces";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

    @UseGuards(AuthGuard)
    @Get('profile')
        async getProfile(@Request() req: {user: JwtPayload}) {
        const userId = req.user.sub;
        return await this.userService.findUserById(userId);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Patch('profile')
    async updateProfile(
        @Request() req: { user: JwtPayload },
        @Body() body: UpdateUserDto
    ) {
        const userId = req.user.sub;
        return this.userService.updateUser(userId, body);
    }

}