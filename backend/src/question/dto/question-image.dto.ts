import { ApiProperty } from "@nestjs/swagger";

export class QuestionImageDto {
    @ApiProperty({ nullable: true, type: String })
    imageUrl: string | null;
}