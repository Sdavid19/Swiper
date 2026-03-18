import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryDto, CreateCategoryDto } from "./dto";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('category')
@ApiBearerAuth()
@Controller('category')
export class CategoryController { 
    constructor(private readonly categoryService: CategoryService) { }
    
    @Get()
    @ApiOkResponse({type: CategoryDto, isArray: true})
    getAllCategories() {
        return this.categoryService.findAll();
    }

    @Post()
    @ApiOkResponse({type: CategoryDto})
    createCategory(@Body() dto: CreateCategoryDto) {
        return this.categoryService.create(dto);
    }

    @Delete(':id')
    deleteCategory(@Param('id') id: string) {
        return this.categoryService.delete(+id);
    }
   
}