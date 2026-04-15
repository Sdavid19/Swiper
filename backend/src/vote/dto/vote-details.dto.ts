import { ApiProperty } from "@nestjs/swagger";
import { AnswerDto } from "./answer.dto";
import { VoteDto } from "./vote.dto";

export class VoteDetailsDto extends VoteDto {
    @ApiProperty()
    answers: AnswerDto[]
}