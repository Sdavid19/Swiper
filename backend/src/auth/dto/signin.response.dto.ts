import { ApiProperty } from "@nestjs/swagger";
import { UserResponseDto } from "../../user/dto";

export class SigninResponseDto {
    @ApiProperty()
    access_token: string;

    @ApiProperty()
    user: UserResponseDto
}