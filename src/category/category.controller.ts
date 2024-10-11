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

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/decorators/permission.decorator';
import { PermissionEnum } from 'src/enums/permission.enum';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Permission(PermissionEnum.CREATE_CATEGORY)
  @ApiOperation({ summary: '创建目录' })
  create(@Request() req: Express.Request, @Body('name') name: string) {
    return this.categoryService.create(req.language, name);
  }

  @Get('all')
  @ApiOperation({ summary: '查询所有目录' })
  findAll(@Request() req: Express.Request) {
    return this.categoryService.findAll(req.language);
  }

  @Get(':id')
  @ApiOperation({ summary: '查询指定目录' })
  findOne(@Request() req: Express.Request, @Param('id') id: string) {
    return this.categoryService.findOne(id, req.language);
  }

  @Delete(':id')
  @Permission(PermissionEnum.DELETE_CATEGORY)
  @ApiOperation({ summary: '删除指定目录, 确保该目录下没有文章' })
  remove(@Request() req: Express.Request, @Param('id') id: string) {
    return this.categoryService.remove(req.language, id);
  }
}
