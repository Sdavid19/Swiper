import { ApiProperty } from "@nestjs/swagger";

export class SignupResponseDto {
    @ApiProperty()
    id: number;
    
    @ApiProperty()
    email: string;
    
    @ApiProperty()
    name: string;

    @ApiProperty({required: false})
    imageUrl?: string;
}