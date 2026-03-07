import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto{
    @ApiProperty()
    id: number;

    @ApiProperty()
    email: string;

    @ApiProperty()
    name: string;

    @ApiProperty({nullable: true})
    imageUrl?: string
}