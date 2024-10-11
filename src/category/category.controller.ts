import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { CategoryService } from './category.service';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Request() req: Express.Request, @Body('name') name: string) {
    return this.categoryService.create(req.language, name);
  }

  @Get('all')
  findAll(@Request() req: Express.Request) {
    return this.categoryService.findAll(req.language);
  }

  @Get(':id')
  findOne(@Request() req: Express.Request, @Param('id') id: string) {
    return this.categoryService.findOne(id, req.language);
  }

  @Delete(':id')
  remove(@Request() req: Express.Request, @Param('id') id: string) {
    return this.categoryService.remove(req.language, id);
  }
}
