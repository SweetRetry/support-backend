import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { CategoryService } from './category.service';

import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Request() req: Express.Request, @Body('name') name: string) {
    return this.categoryService.create({
      name,
      language: req.language,
    });
  }

  @Get('all')
  findAll(@Request() req: Express.Request) {
    return this.categoryService.findAll(req.language);
  }

  @Get(':id')
  findOne(@Request() req: Express.Request, @Param('id') id: string) {
    return this.categoryService.findOne(id, req.language);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
