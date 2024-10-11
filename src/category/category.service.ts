import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}
  async create(language: string, name: string) {
    return await this.prisma.category.create({
      data: {
        name,
        language,
      },
    });
  }

  async findAll(language: string) {
    return await this.prisma.category.findMany({
      where: {
        language,
      },
    });
  }

  async findOne(id: string, language: string) {
    return await this.prisma.category.findUnique({
      where: {
        id_language: {
          id,
          language,
        },
      },
    });
  }

  async remove(language: string, id: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        id_language: {
          id,
          language,
        },
      },
      include: {
        articles: true,
      },
    });
    if (category?.articles.length) {
      throw new BadRequestException();
    }
    const deleteCategory = await this.prisma.category.delete({
      where: {
        id_language: {
          id,
          language,
        },
      },
    });

    return deleteCategory.id;
  }
}
