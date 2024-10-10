import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateUserPasswordSchema = z.object({
  id: z.string(),
  password: z.string(),
  oldPassword: z.string(),
});

export class UpdateUserPasswordDto extends createZodDto(
  updateUserPasswordSchema,
) {
  @ApiProperty()
  password: string;

  @ApiProperty()
  oldPassword: string;
}

export const updateUserRoleSchema = z.object({
  id: z.string(),
  roleId: z.string(),
});

export class UpdateUserRoleDto extends createZodDto(updateUserPasswordSchema) {
  @ApiProperty()
  roleId: string;
}
