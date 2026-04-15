import { ApiProperty } from "@nestjs/swagger";
import { QuestionDto } from "../../question/dto/question.dto";
import { UserDto } from "../../user/dto";


export class UserAnswerDto {
    
  @ApiProperty({ type: [UserDto] })
  user: UserDto

  @ApiProperty()
  answer: boolean;
}

export class AnswerStatDto {

  @ApiProperty()
  yes: number;

  @ApiProperty()
  no: number;

  @ApiProperty()
  question: QuestionDto;

  @ApiProperty({ type: [UserAnswerDto] })
  answers: UserAnswerDto[];
}

