import { ApiProperty } from "@nestjs/swagger";

export class CategoryDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    slug: string;

    @ApiProperty()
    color: string;
}