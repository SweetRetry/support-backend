// import { ApiProperty } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createUserSchema = z
  .object({
    email: z.string().email({ message: 'invalid email' }),
    password: z.string({ message: 'password cannot be empty' }).min(6).max(20),
  })
  .required();

export class CreateUserDto extends createZodDto(createUserSchema) {
  @ApiProperty({ example: 'admin@test.com', description: 'User email' })
  email: string;

  @ApiProperty({
    example: 'admin123',
    description: 'User password',
  })
  password: string;

  @ApiProperty()
  roleId?: string;
}
