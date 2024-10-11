import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createArticleSchema = z.object({
  title: z.string().min(3).max(50),
  content: z.string().min(1),
  description: z.string().min(1),
  categoryId: z.string().optional(),
});

export class CreateArticleDto extends createZodDto(createArticleSchema) {}
