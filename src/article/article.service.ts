import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindAllArticleDto } from './dto/find-article.dto';
import { ArticleStatus } from '@prisma/client';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async create(language: string, createArticleDto: CreateArticleDto) {
    await this.prisma.article.create({
      data: { ...createArticleDto, language },
    });
    return null;
  }

  async findAll(language: string, findAllArticleDto: FindAllArticleDto) {
    let wherePattern;
    if (findAllArticleDto.status === 'PENDING') {
      wherePattern = {
        OR: findAllArticleDto.keyword
          ? [
              {
                title: {
                  contains: findAllArticleDto.keyword,
                },
              },
              {
                description: {
                  contains: findAllArticleDto.keyword,
                },
              },
            ]
          : undefined,

        status: ArticleStatus.PUBLISHED,
        publishedAt: {
          gte: new Date(),
        },
        categoryId: findAllArticleDto.categoryId,
        language,
      };
    } else {
      wherePattern = {
        OR: findAllArticleDto.keyword
          ? [
              {
                title: {
                  contains: findAllArticleDto.keyword,
                },
              },
              {
                description: {
                  contains: findAllArticleDto.keyword,
                },
              },
            ]
          : undefined,
        NOT: {
          status: ArticleStatus.DELETED,
        },
        status: findAllArticleDto.status as ArticleStatus,
        categoryId: findAllArticleDto.categoryId,
        language,
      };
    }

    const list = await this.prisma.article.findMany({
      take: findAllArticleDto.pageSize,
      skip: (findAllArticleDto.pageId - 1) * findAllArticleDto.pageSize,
      where: wherePattern,
      include: {
        category: true,
      },
    });

    const totalCount = await this.prisma.article.count({
      where: wherePattern,
    });

    return {
      list,
      totalPage: Math.ceil(totalCount / findAllArticleDto.pageSize),
      totalCount,
    };
  }

  async findOne(language: string, id: string) {
    return await this.prisma.article.findUnique({
      where: {
        id_language: {
          id,
          language,
        },
      },
    });
  }

  async update(
    language: string,
    id: string,
    updateArticleDto: UpdateArticleDto,
  ) {
    const article = await this.prisma.article.update({
      where: {
        id_language: {
          id,
          language,
        },
      },
      data: updateArticleDto,
    });
    return article.id;
  }

  async remove(language: string, id: string) {
    const { id: articlId } = await this.prisma.article.update({
      where: {
        id_language: {
          id,
          language,
        },
      },
      data: {
        status: ArticleStatus.DELETED,
      },
    });

    return articlId;
  }

  async publish(language: string, id: string, publishedAt: Date) {
    const { id: articleId } = await this.prisma.article.update({
      where: {
        id_language: {
          id,
          language,
        },
      },
      data: {
        status: ArticleStatus.PUBLISHED,
        publishedAt,
      },
    });

    return articleId;
  }
}
