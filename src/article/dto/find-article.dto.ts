import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const FindAllArticleSchema = z.object({
  status: z.string().optional(),
  keyword: z.string().optional(),
  pageId: z.preprocess((val) => {
    if (typeof val === 'string') {
      return parseInt(val, 10); // 将 pageId 字符串转换为数字
    }
    return val;
  }, z.number()), // 最终验证为数字类型
  pageSize: z.preprocess((val) => {
    if (typeof val === 'string') {
      return parseInt(val, 10); // 将 pageSize 字符串转换为数字
    }
    return val;
  }, z.number()),
  categoryId: z.string().optional(),
});

export class FindAllArticleDto extends createZodDto(FindAllArticleSchema) {}
