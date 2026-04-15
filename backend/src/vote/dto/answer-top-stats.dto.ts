import { ApiProperty } from "@nestjs/swagger";
import { AnswerStatDto } from "./answer-stat.dto";
import { IsArray } from "class-validator";
import { Type } from "class-transformer";

export class AnswerTopStatsDto {
  @ApiProperty({ type: [AnswerStatDto] })
  @IsArray()
  @Type(() => AnswerStatDto)
  stats: AnswerStatDto[];

  @ApiProperty()
  userCount: number
}