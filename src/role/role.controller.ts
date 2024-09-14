import { Controller, Get, Param } from '@nestjs/common';
import { RoleService } from './role.service';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findRoleById(id);
  }
}
