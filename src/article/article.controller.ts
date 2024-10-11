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

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @Permission(PermissionEnum.EDIT_ARTICLE)
  create(
    @Request() req: Express.Request,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    return this.articleService.create(req.language, createArticleDto);
  }

  @Get('/all')
  findAll(
    @Request() req: Express.Request,
    @Query() findAllArticleDto: FindAllArticleDto,
  ) {
    return this.articleService.findAll(req.language, findAllArticleDto);
  }

  @Get(':id')
  findOne(@Request() req: Express.Request, @Param('id') id: string) {
    return this.articleService.findOne(req.language, id);
  }

  @Patch(':id/edit')
  @Permission(PermissionEnum.EDIT_ARTICLE)
  update(
    @Request() req: Express.Request,
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articleService.update(req.language, id, updateArticleDto);
  }

  @Patch(':id/publish')
  @Permission(PermissionEnum.PUBLISH_ARTICLE)
  publish(
    @Request() req: Express.Request,
    @Param('id') id: string,
    @Body('publishedAt') publishedAt: Date,
  ) {
    return this.articleService.publish(req.language, id, publishedAt);
  }

  @Delete(':id')
  @Permission(PermissionEnum.DELETE_ARTICLE)
  remove(@Request() req: Express.Request, @Param('id') id: string) {
    return this.articleService.remove(req.language, id);
  }
}
