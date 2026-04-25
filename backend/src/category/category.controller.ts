import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto, CreateCategoryDto } from './dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('category')
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get()
  @ApiOkResponse({
    type: CategoryDto,
    isArray: true,
  })
  @UseGuards(AuthGuard)
  getAllCategories() {
    return this.categoryService.findAll();
  }

  @Post()
  @ApiOkResponse({ type: CategoryDto })
  @UseGuards(AuthGuard)
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.delete(+id);
  }
}
