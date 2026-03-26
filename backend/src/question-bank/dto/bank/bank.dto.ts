import { ApiProperty } from "@nestjs/swagger";
import { CategoryDto } from "../../../category/dto";
import { UserDto } from "../../../user/dto";

export class BankDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    public: boolean;

    @ApiProperty()
    usageCount: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty({ type: () => UserDto })
    creator: UserDto;

    @ApiProperty({ type: () => CategoryDto })
    category: CategoryDto;

    @ApiProperty({ nullable: true, type: String })
    imageUrl: string | null
}