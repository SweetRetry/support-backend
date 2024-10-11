import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Permission } from 'src/decorators/permission.decorator';
import { PermissionEnum } from 'src/enums/permission.enum';
import { FindAllArticleDto } from './dto/find-article.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @ApiOperation({ summary: '创建文章' })
  @Permission(PermissionEnum.EDIT_ARTICLE)
  create(
    @Request() req: Express.Request,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    return this.articleService.create(req.language, createArticleDto);
  }

  @Get('/all')
  @ApiOperation({ summary: '获取所有文章' })
  findAll(
    @Request() req: Express.Request,
    @Query() findAllArticleDto: FindAllArticleDto,
  ) {
    return this.articleService.findAll(req.language, findAllArticleDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取指定文章' })
  findOne(@Request() req: Express.Request, @Param('id') id: string) {
    return this.articleService.findOne(req.language, id);
  }

  @Patch(':id/edit')
  @ApiOperation({ summary: '编辑文章' })
  @Permission(PermissionEnum.EDIT_ARTICLE)
  update(
    @Request() req: Express.Request,
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articleService.update(req.language, id, updateArticleDto);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: '发布文章' })
  @Permission(PermissionEnum.PUBLISH_ARTICLE)
  publish(
    @Request() req: Express.Request,
    @Param('id') id: string,
    @Body('publishedAt') publishedAt: Date,
  ) {
    return this.articleService.publish(req.language, id, publishedAt);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除文章' })
  @Permission(PermissionEnum.DELETE_ARTICLE)
  remove(@Request() req: Express.Request, @Param('id') id: string) {
    return this.articleService.remove(req.language, id);
  }
}
