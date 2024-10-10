import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async create(createArticleDto: CreateArticleDto & { language: string }) {
    await this.prisma.article.create({
      data: createArticleDto,
    });
    return null;
  }

  findAll() {
    return `This action returns all article`;
  }

  findOne(id: string) {
    return `This action returns a #${id} article`;
  }

  update(id: string, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: string) {
    return `This action removes a #${id} article`;
  }
}
