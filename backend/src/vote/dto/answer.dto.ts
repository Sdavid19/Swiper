import { ApiProperty } from "@nestjs/swagger";
import { QuestionDto } from "../../question/dto/question.dto";

export class AnswerDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    answer: boolean;

    @ApiProperty()
    question: QuestionDto;

    @ApiProperty()
    userId: number;
}