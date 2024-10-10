import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    return await this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        language: createCategoryDto.language,
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

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: string) {
    return `This action removes a #${id} category`;
  }
}
