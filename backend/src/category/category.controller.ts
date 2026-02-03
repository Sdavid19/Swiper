import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto";

@Controller('category')
export class CategoryController { 
    constructor(private readonly categoryService: CategoryService) { }
    
    @Get()
    getAllCategories() {
        return this.categoryService.findAll();
    }

    @Post()
    createCategory(@Body() dto: CreateCategoryDto) {
        return this.categoryService.create(dto);
    }

    @Delete(':id')
    deleteCategory(@Param('id') id: string) {
        return this.categoryService.delete(+id);
    }
   
}