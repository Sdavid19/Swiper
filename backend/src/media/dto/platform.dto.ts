import { ApiProperty } from "@nestjs/swagger";

export class PlatformDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty({ nullable: true, type: String })
    imageUrl: string | null

}